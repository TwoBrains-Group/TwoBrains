// import {writeFile, mkdir} from 'fs/promises'
// import {existsSync} from 'fs'
// import appRootPath from 'app-root-path'
// import path from 'path'
// import {escapeNames} from '@utils/template-engine'
// import appStruct from './struct/app-struct'
// import structs from './struct/structs'
//
// type Bus = Array<{
//     func: (...args: any[]) => any
//     args: any[]
// }>
//
// const USAGE = `
// Usage:
//     > make app {name}
//     > make method {app_name} {name}
// `
//
// const APPS_PATH = `${appRootPath.toString()}/src/apps`
//
// const APP_DIR_STRUCT = {}
//
// const genStruct = async (root: string, struct: Record<string, any>, bus: Bus) => {
//     for (const [key, val] of Object.entries(struct)) {
//         if (typeof val === 'string') {
//             if (val.startsWith('@')) {
//                 const templateName = val.slice(1)
//                 if (!Object.keys(structs).includes(templateName)) {
//                     throw new Error(`Template with name ${templateName} not found`)
//                 }
//                 const template = (structs as Record<string, any>)[templateName]
//                 bus.push({
//                     func: async () => {
//                         const escaped = escapeNames(template)
//                     },
//                     args: [],
//                 })
//             } else {
//                 bus.push({
//                     func: writeFile,
//                     args: [path.join(root, key), val],
//                 })
//             }
//         }
//     }
// }
//
// const makeApp = async (name: string) => {
//     const newAppPath = path.join(APPS_PATH, name)
//     name = name.toLowerCase()
//
//     if (existsSync(newAppPath)) {
//         throw new Error('App with this name already exists')
//     }
//
//     // Note: Pascal case
//     const namePC = `${name[0].toUpperCase()}${name.slice(1)}`
//
//
// }
//
// const makeMethod = async (service: string, name: string) => {
//     return {}
// }
//
// (async () => {
//     const instr = process.argv[2]
//
//     if (!['app', 'method'].includes(instr) || process.argv.length <= 3 || process.argv.length >= 6) {
//         console.error(USAGE)
//         return
//     }
//
//     try {
//         if (instr === 'app') {
//             await makeApp(process.argv[3])
//             return
//         }
//
//         if (instr === 'method') {
//             await makeMethod(process.argv[3], process.argv[4])
//         }
//     } catch (error) {
//         console.error('An error occurred:', error.message)
//     }
//
// })()
