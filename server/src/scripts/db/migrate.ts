import '../../utils/register'
import {existsSync, readFileSync, writeFileSync, readdirSync} from 'fs'
import path from 'path'
import DB from '@modules/db'
import {QueryReturnType} from '@modules/db/pool'
import l10n from './l10n'
import DBInstance from '@modules/db/instance'
import minimist from 'minimist'
import {Level} from '@modules/logger'
import {Script} from '../script'

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

    getMigrations: `
        SELECT COALESCE(array_agg(m.name), '{}') AS "names"
        FROM main.migrations AS m;`,

    up: (name: string) => `INSERT INTO main.migrations (name) VALUES ('${name}');`,
    down: (name: string) => `DELETE FROM main.migrations WHERE name = '${name}'`,
}

type Migrations = Record<string, string>

class Migrate extends Script {
    ranMigrations: string[] = []
    migrations: {up: Migrations, down: Migrations} = {
        up: {},
        down: {},
    }
    db: DBInstance
    count: number
    command: string
    commands: Record<string, () => void> = {
        up: this.migrate,
        down: this.migrate,
        check: this.check,
    }

    constructor() {
        super('migrate')
    }

    async run() {
        if (!existsSync(MIGRATIONS_PATH)) {
            throw new Error(`DB path not found (${MIGRATIONS_PATH})`)
        }

        this.applyArgs()

        this.db = await DB.getInstance()
        this.db.setLogLevel(Level.Error)
        await this.db.query('createMigrations', queries.createMigrations)

        try {
            await this.loadMigrations()
        } catch (error) {
            this.log.error('Failed to load migrations:', error.message)
            await this.closeConnection()
            return
        }

        try {
            await this.commands[this.command].call(this)
        } catch (error) {
            this.log.error('An error occurred:', error)
            await this.closeConnection()
            return
        }

        await this.closeConnection()
    }

    async closeConnection() {
        await DB.close(this.db)
    }

    applyArgs() {
        const args = minimist(process.argv.slice(2), {
            string: ['count'],
            alias: {
                c: 'count',
            },
        })

        this.count = Number(args.count)
        this.command = args._[0]

        if (!Object.keys(this.commands).includes(this.command)) {
            throw new Error(`Invalid command ${this.command}`)
        }
    }

    async loadScripts(): Promise<void> {
        writeFileSync(path.join(MIGRATIONS_PATH, 'up/tb-script-l10n.sql'), await l10n('up'))
        writeFileSync(path.join(MIGRATIONS_PATH, 'down/tb-script-l10n.sql'), await l10n('down'))
    }

    async loadMigrations(): Promise<void> {
        const upMigrationsPath = path.join(MIGRATIONS_PATH, 'up')
        const downMigrationsPath = path.join(MIGRATIONS_PATH, 'down')

        const upMigrationsFiles = readdirSync(upMigrationsPath)
        const downMigrationsFiles = readdirSync(downMigrationsPath)
        upMigrationsFiles.sort()
        downMigrationsFiles.sort().reverse()

        this.ranMigrations = await this.db.query('getMigrations', queries.getMigrations, {}, {
            returnType: QueryReturnType.Row,
            returnField: 'names',
        })

        await this.loadScripts()

        for (const filename of upMigrationsFiles) {
            if (this.ranMigrations.includes(filename)) {
                continue
            }

            this.migrations.up[filename] = readFileSync(path.join(MIGRATIONS_PATH, 'up', filename), {
                encoding: 'utf8',
            })
        }

        for (const filename of downMigrationsFiles) {
            if (!this.ranMigrations.includes(filename)) {
                continue
            }

            this.migrations.down[filename] = readFileSync(path.join(MIGRATIONS_PATH, 'down', filename), {
                encoding: 'utf8',
            })
        }
    }

    async migrate() {
        if (!['up', 'down'].includes(this.command)) {
            throw new Error('Invalid migrate command')
        }

        if (!Object.keys(this.migrations.up).length && !Object.keys(this.migrations.down)) {
            this.log.warn('No migrations to run')
        }

        // Ahah, killmepls
        const up = this.command === 'up'
        const where = up ? 'up' : 'down'

        let counter = 0
        for (const [name, query] of Object.entries(this.migrations[where])) {
            if (counter >= this.count) {
                this.log.debug(`Ran ${this.count} migrations`)
                break
            }

            console.debug(`Run ${this.command} migration ${name}`)

            try {
                await this.db.query(name, query)

                const queryFunc = up ? queries.up : queries.down
                await this.db.query(`${where}-migration`, queryFunc(name))
            } catch (error) {
                this.log.error(`An error occurred while running migration ${name}:`, error.message)
                break
            } finally {
                counter++
            }
        }
    }

    async check() {
        this.log.info(`Migrated: ${this.ranMigrations.length}/${this.ranMigrations.length + Object.keys(this.migrations.up).length}`)

        for (const migrationName of Object.keys(this.migrations.up)) {
            this.log.info(`[-] ${migrationName}`)
        }

        for (const migrationName of Object.keys(this.migrations.down)) {
            this.log.info(`[+] ${migrationName}`)
        }
    }
}

(async () => {
    try {
        const migrate = new Migrate()
        await migrate.run()
    } catch (error) {
        console.log(error)
        console.error('An error occurred:', error.message)
    }
})()
