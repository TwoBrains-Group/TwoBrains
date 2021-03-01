export type ReqRes = {
    app?: string
    method?: string
    token?: string
}

export type Req = ReqRes & {
    params: any
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
        throw new Error('Result is null')
    }
    if (res.hasOwnProperty('result')) {
        return res as Res
    }
    return {
        ...template,
        result: res,
    }
}
