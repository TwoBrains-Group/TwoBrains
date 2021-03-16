import {Fields, Files} from 'formidable'

export type ReqRes = {
    app?: string
    method?: string
    token?: string
}

export type Req = ReqRes & {
    params: any
}

export type FormDataReq = ReqRes & {
    formData: {
        fields: Fields
        files: Files
    }
}

export type Res = ReqRes & {
    result: Record<string, any>
}

export type MethodRes = Res | Record<string, any> | never

export const template: ReqRes = {
    app: undefined,
    method: undefined,
}

export const getRes = (res: MethodRes): Res => {
    if (!res) {
        throw new Error('Result is null or undefined')
    }
    if ('result' in res) {
        return {
            ...template,
            ...res,
        } as Res
    }
    return {
        ...template,
        result: res,
    }
}
