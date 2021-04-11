import '../../utils/register'
import {existsSync, mkdirSync, readdirSync, writeFileSync} from 'fs'
import appRootPath from 'app-root-path'
import path from 'path'
import {escapeNames} from '@utils/template-engine'
import templates from './struct/templates'
import appStruct from './struct/app-struct'
import methodStruct from './struct/method-struct'

const enum Instruction {
    WF = 'WriteFile',
    MD = 'MakeDir',
    TPL = 'Template',
    UpdInd = 'UpdateIndex',
}

type Bus = Array<{
    instr: Instruction
    func: (...args: any[]) => any
    args: any[]
}>

const USAGE = `
Usage:
    > make app {name}
    > make method {app_name} {name}
`

const APPS_PATH = `${appRootPath.toString()}/src/apps`

const getFileName = (name: string) =>
    name.replace(/([a-z])([A-Z])/g, text => `${text[0]}-${text[1].toLowerCase()}`).split('.')[0]

const getNameFromFile = (filename: string) =>
    filename.replace(/(\w-\w)/g, text => `${text[0]}${text[2].toUpperCase()}`).split('.')[0]

const escapeNamesFile = (template: string, params: Record<string, string>) => `${escapeNames(template, params, true).trim()}\n`

const genStruct = async (prevDir: string, struct: Record<string, any>, params: Record<string, string>, bus: Bus = []): Promise<Bus> => {
    for (const [key, val] of Object.entries(struct)) {
        let name = key
        let command

        if (key.startsWith('__')) {
            const parts = key.slice(2).split('_')
            command = parts[0]
            name = parts[1]

            if (!name) {
                throw new Error(`Expected name after command ${command}`)
            }
        }

        if (typeof val === 'string') {
            // gen file
            let ext = ''
            if (name.startsWith('$')) {
                const parts = name.slice(1).split('.')
                name = params[parts[0]]
                ext = parts.length > 1 ? `.${parts[1]}` : ''
                if (!name) {
                    throw new Error(`Got no param for file key ${key}`)
                }
            }

            const filepath = path.join(prevDir, `${name}${ext}`)

            if (existsSync(filepath)) {
                console.log(`File ${filepath} already exists, skip it`)
                continue
            }

            if (val.startsWith('$')) {
                const templateName = val.slice(1)
                if (!Object.keys(templates).includes(templateName)) {
                    throw new Error(`Template with name ${templateName} not found`)
                }
                const template = (templates as Record<string, any>)[templateName]
                bus.push({
                    instr: Instruction.TPL,
                    func: writeFileSync,
                    args: [filepath, escapeNamesFile(template, params)],
                })
            } else {
                bus.push({
                    instr: Instruction.WF,
                    func: writeFileSync,
                    args: [filepath, val],
                })
            }

            if (command) {
                throw new Error(`Files do not support commands: ${command}`)
            }
        } else {
            // gen dir
            let dirName
            if (name.startsWith('$')) {
                dirName = params[name.slice(1)]
                if (!dirName) {
                    throw new Error(`Got no param for dir key ${key}`)
                }
            } else {
                dirName = name
            }

            const dirPath = path.join(prevDir, dirName)

            if (!existsSync(dirPath)) {
                bus.push({
                    instr: Instruction.MD,
                    func: mkdirSync,
                    args: [dirPath],
                })
            }

            await genStruct(dirPath, val, params, bus)

            if (command === 'updateIndex') {
                bus.push({
                    instr: Instruction.UpdInd,
                    func: updateIndex,
                    args: [dirPath],
                })
            }
        }
    }

    return bus
}

const updateIndex = (dirPath: string): void => {
    let files = readdirSync(dirPath)
    const filepath = path.join(dirPath, 'index.ts')

    if (!existsSync(dirPath)) {
        console.log(`updateIndex error: dir ${dirPath} does not exists`)
        return
    }

    files = files.filter(file => file !== 'index.ts' && !file.startsWith('_'))

    const names = files.map(filename => getNameFromFile(filename))

    names.sort()

    const imports = names.reduce((acc, el) => {
        return `${acc}${escapeNames(templates.importDefault, {
            name: el,
            filename: getFileName(el),
        }, true)}\n`
    }, '')

    const exports = escapeNames(templates.exportDefault, {
        exports: `${names.join(',\n    ')},`,
    }, true)

    const str = escapeNamesFile(templates.collectionIndex, {
        imports,
        exports,
    })

    writeFileSync(filepath, str)
}

const execBus = async (bus: Bus): Promise<void> => {
    for (const step of bus) {
        await step.func(...step.args)
    }
}

const makeApp = async (name: string) => {
    const newAppPath = path.join(APPS_PATH, name)
    name = name.toLowerCase()

    // if (existsSync(newAppPath)) {
    //     throw new Error('App with this name already exists')
    // }

    const namePC = `${name[0].toUpperCase()}${name.slice(1)}`

    const params = {
        namePC,
        name,
    }

    const bus = await genStruct(APPS_PATH, appStruct, params)

    bus.push({
        instr: Instruction.UpdInd,
        func: updateIndex,
        args: [APPS_PATH],
    })

    await execBus(bus)
}

const makeMethod = async (app: string, name: string) => {
    // TODO: Versioning

    if (!app || !name) {
        console.error(USAGE)
        return
    }

    app = app.toLowerCase()
    name = name.toLowerCase()

    const appPath = path.join(APPS_PATH, app)

    if (!existsSync(appPath)) {
        throw new Error(`App '${app}' does not exists`)
    }

    const namePC = `${name[0].toUpperCase()}${name.slice(1)}`

    const params = {
        app,
        name,
        namePC,
        version: 'v1',
    }

    const bus = await genStruct(APPS_PATH, methodStruct, params)

    await execBus(bus)
}

(async () => {
    const instr = process.argv[2]

    if (!['app', 'method'].includes(instr) || process.argv.length <= 3 || process.argv.length >= 6) {
        console.error(USAGE)
        return
    }

    try {
        if (instr === 'app') {
            await makeApp(process.argv[3])
        } else if (instr === 'method') {
            await makeMethod(process.argv[3], process.argv[4])
        }
    } catch (error) {
        console.error('An error occurred:', error.message)
    }

})()
