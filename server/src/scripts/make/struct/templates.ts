const appIndex = `
import {AppProps, BaseApp} from '@apps/base'
import express from 'express'

class {{namePC}} extends BaseApp {
    constructor(props: AppProps) {
        super(props)
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
    async _init(expApp: express.Application): Promise<void> {}
}

export default new {{namePC}}({
    name: '{{name}}',
})
`

const versionIndex = `
import methods from './methods'
import queries from './queries'
import schemas from './schemas'

export default {
    methods,
    queries,
    schemas,
}
`

const emptyExportDefault = 'export default {}'

const apiIndex = `
import v1 from './v1'

export default {
    v1,
}
`

const collectionIndex = `
{{imports}}
{{exports}}
`

const importDefault = 'import {{name}} from \'./{{filename}}\''
const exportDefault = `export default {
    {{exports}}
}`

const method = `
import {Method, MethodRes, Req} from '@apps/base/Method'

class {{namePC}} extends Method {
    async run(req: Req, user: any): Promise<MethodRes> {
        const {params} = req
        const {id: loggedInUserId} = user

        // Start from here 😺

        return {}
    }
}

export default new {{namePC}}({
    name: '{{name}}',
})
`

const schema = `
export default {
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {},
}
`

export default {
    appIndex,
    versionIndex,
    emptyExportDefault,
    apiIndex,
    collectionIndex,
    importDefault,
    exportDefault,
    method,
    schema,
}
