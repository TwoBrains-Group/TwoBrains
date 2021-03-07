import {Fields, Files} from "formidable";

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
    result: object
}

export type MethodRes = Res | object | never

export const template: ReqRes = {
    app: undefined,
    method: undefined,
}

export const getRes = (res: MethodRes): Res => {
    if (!res) {
        throw new Error('Result is null or undefined')
    }
    if (res.hasOwnProperty('result')) {
        return {...template, ...res} as Res
    }
    return {
        ...template,
        result: res,
    }
}
