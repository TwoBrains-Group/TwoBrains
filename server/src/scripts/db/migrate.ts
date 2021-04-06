import 'module-alias/register'
import '@utils/dotenv'
import {readdir, readFile} from 'fs/promises'
import {existsSync} from 'fs'
import path from 'path'
import DB from '@modules/db'
import {QueryReturnType} from '@modules/db/pool'

const MIGRATIONS_PATH = 'db/migrations'

const queries = {
    createMigrations: `
        CREATE TABLE IF NOT EXISTS main.migrations (
            name TEXT NOT NULL,
            datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            CONSTRAINT migrations_name_ukey UNIQUE (name)
        );

        COMMENT ON TABLE main.migrations IS 'Migration';
        COMMENT ON COLUMN main.migrations.name IS 'Migration name';
        COMMENT ON COLUMN main.migrations.datetime IS 'Migration execution timestamp';
    `,
    dropMigrations: 'DROP TABLE main.migrations;',

    getMigrations: (up: boolean) => `
        SELECT COALESCE(array_agg(m.name), '{}') AS "names"
        FROM main.migrations AS m
        ORDER BY MAX(m.datetime) ${up ? 'ASC' : 'DESC'};`,

    up: (name: string) => `INSERT INTO main.migrations (name) VALUES ('${name}');`,
    down: (name: string) => `DELETE FROM main.migrations WHERE name = '${name}'`,
}

const loadMigrations = async (where: string, ranMigrations: string[]): Promise<Record<string, any>> => {
    const p = path.join(MIGRATIONS_PATH, where)

    const migrationsFiles = await readdir(p)
    migrationsFiles.sort()

    if (where === 'down') {
        migrationsFiles.reverse()
    }

    const migrations: Record<string, any> = {}
    for (const filename of migrationsFiles) {
        if (where === 'up' && ranMigrations.includes(filename)) {
            continue
        }

        if (where === 'down' && !ranMigrations.includes(filename)) {
            continue
        }

        migrations[filename] = await readFile(path.join(MIGRATIONS_PATH, where, filename), {
            encoding: 'utf8',
        })
    }

    return migrations
}

const migrate = async (where: string, count: number) => {
    if (!existsSync(MIGRATIONS_PATH)) {
        throw new Error(`DB path not found (${MIGRATIONS_PATH})`)
    }

    const up = where === 'up'

    const pool = await DB.getInstance()
    await pool.query('createMigrations', queries.createMigrations)

    const ranMigrations = await pool.query('getMigrations', queries.getMigrations(up), {}, {
        returnType: QueryReturnType.Row,
        returnField: 'names',
    })

    let migrations
    try {
        migrations = await loadMigrations(where, ranMigrations)
    } catch (error) {
        console.error('Failed to load migrations:', error.message)
        return
    }

    let counter = 0
    for (const [name, query] of Object.entries(migrations)) {
        if (counter > count) {
            return
        }

        console.info(`Run ${where} migration ${name}`)

        try {
            await pool.query(name, query)

            const queryFunc = up ? queries.up : queries.down
            await pool.query(`${where}-migration`, queryFunc(name))
        } catch (error) {
            console.error(`An error occurred while running migration ${name}:`, error.message)
            return
        } finally {
            counter++
        }
    }

    await DB.close(pool)
}

(async () => {
    try {
        const where = process.argv[2]
        const count = process.argv[3]

        if (!where) {
            console.error('Usage: npm run migrate up/down [count]')
            return
        }

        if (!['up', 'down'].includes(where)) {
            console.error('Migration type must be \'up\' or \'down\'')
            return
        }

        await migrate(where, Number(count) || +Infinity)
    } catch (error) {
        console.error('An error occurred:', error.message)
    }
})()
