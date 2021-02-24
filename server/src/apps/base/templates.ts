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

export const template: ReqRes = {
    app: null,
    method: null,
}

export const getRes = (res: Res | any): Res => {
    if (res.hasOwnProperty('result')) {
        return res
    }
    return {
        ...template,
        result: res,
    }
}
