import {MustBeOverridden} from '@utils/errors'
import Logger from '@modules/logger'
import {default as DB} from '@modules/db'
import {queryDefaultOptions, QueryOptions, QueryParams} from '@modules/db/pool'
import {Req, MethodRes, FormDataReq} from '@apps/base/templates'
import DBInstance from '@modules/db/instance'

export type MethodProps = {
    useDB?: boolean,
    route: string,
    formData?: boolean
    formDataMult?: boolean
}

export type MethodInitData = {
    queries?: Record<string, string>
    appName: string
}

export type AuthUser = {
    id: string
}

export abstract class Method {
    appName: string
    log: Logger
    db?: DBInstance
    useDB: boolean
    route: string
    formData?: boolean
    formDataMult?: boolean
    private queries?: Record<string, string>

    constructor(props: MethodProps) {
        this.appName = ''
        this.route = `/${props.route}`.replace(/\/{2,}/g, '/')
        this.useDB = props.useDB || true
        this.formData = props.formData
        this.formDataMult = props.formDataMult
    }

    async init(appData: MethodInitData): Promise<void> {
        this.appName = appData.appName
        this.queries = appData.queries

        this.log = new Logger({
            owner: this.getPath(),
        })

        if (this.useDB) {
            this.db = await DB.getInstance()
        }

        await this._init()

        this.log.info(`Route ${this.getPath()} inited`)
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected async _init(): Promise<void> {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async run(req: Req, user?: AuthUser): Promise<MethodRes> {
        throw new MustBeOverridden('run', `method ${this.getPath()}`)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async runFormData(req: FormDataReq, user?: AuthUser): Promise<MethodRes> {
        throw new MustBeOverridden('runFormData', `method ${this.getPath()}`)
    }

    /**
     * getName
     */
    getPath(): string {
        return this.appName + '/' + this.getName()
    }

    getName(): string {
        return this.constructor.name[0].toLowerCase() + this.constructor.name.slice(1)
    }

    async query(queryName: string, params: QueryParams = {}, options: QueryOptions = {}): Promise<any> {
        if (!this.useDB) {
            throw new Error(`Attempt to use DB in route with disabled DB (${this.getPath()})`)
        }
        if (!this.db) {
            throw new Error(`Failed to initialize DB on request to route ${this.getPath()}`)
        }

        options = {...queryDefaultOptions, ...options}

        const query = this.queries![queryName]
        if (!query) {
            this.log.error(`No query found by name '${queryName}' in route ${this.getPath()}`)
            return null
        }

        return await this.db.query(queryName, query, params, options)
    }
}

export {Req, FormDataReq, Res, MethodRes} from '@apps/base/templates'
