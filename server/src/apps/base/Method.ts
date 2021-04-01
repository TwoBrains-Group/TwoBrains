import {MustBeOverridden} from '@utils/errors'
import Logger from '@modules/logger'
import {default as DB} from '@modules/db'
import {Query, queryDefaultOptions, QueryOptions, QueryParams} from '@modules/db/pool'
import {Req, MethodRes, FormDataReq} from '@apps/base/templates'
import DBInstance from '@modules/db/instance'
import ajv from '@modules/ajv'
import {JSONSchemaType, ValidateFunction} from 'ajv'
import {InvalidParams} from '@apps/base/errors'
import {Request} from 'express'

export type MethodProps = {
    useDB?: boolean
    auth?: boolean
    name: string
    formData?: boolean
    formDataMult?: boolean
}

export type MethodInitData = {
    queries?: Record<string, string>
    appName: string
    schema: JSONSchemaType<any>
}

export type AuthUser = {
    id: string
}

export abstract class Method {
    protected appName: string
    protected log: Logger
    protected db?: DBInstance
    useDB: boolean
    auth: boolean
    name: string
    formData?: boolean
    formDataMult?: boolean
    private queries?: Record<string, Query>
    private schema: JSONSchemaType<any>
    private validateSchema: ValidateFunction

    constructor(props: MethodProps) {
        this.appName = ''
        this.name = props.name || this.getName()
        this.useDB = props.useDB || true
        this.formData = props.formData
        this.formDataMult = props.formDataMult

        if ('auth' in props) {
            this.auth = props.auth!
        } else {
            this.auth = true
        }
    }

    async init(data: MethodInitData): Promise<void> {
        this.appName = data.appName
        this.queries = data.queries
        this.schema = data.schema

        this.validateSchema = ajv.compile(this.schema)

        this.log = new Logger({
            owner: this.getPath(),
        })

        if (this.useDB) {
            this.db = await DB.getInstance()
        }

        await this._init()

        this.log.info(`Method ${this.getPath()} inited`)
    }

    async validate({params}: Request): Promise<void> {
        const valid = await this.validateSchema(params)

        if (!valid) {
            console.log(this.validateSchema.errors)
            throw new InvalidParams(ajv.errors || this.validateSchema.errors)
        }
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

        options = {
            ...queryDefaultOptions,
            ...options,
        }

        let query = this.queries![queryName]
        if (!query) {
            this.log.error(`No query found by name '${queryName}' in route ${this.getPath()}`)
            return null
        }

        if (typeof query === 'function') {
            if (!options.args) {
                throw new Error(`(${queryName}) 'args' must be passed to query options for func-type query`)
            }
            query = query(options.args) as string
        }

        return await this.db.query(queryName, query, params, options)
    }
}

export {Req, FormDataReq, Res, MethodRes} from '@apps/base/templates'
