export type ReqRes = {
    app?: string
    method?: string
}

export type Req = ReqRes & {
    params: object
}

export type Res = ReqRes & {
    result: object
}

export const template: ReqRes = {
    app: null,
    method: null,
}


export const getRes = (res: Res | any): Res => {
    if (res.hasOwnProperty('data')) {
        return res
    }
    return {
        ...template,
        result: res,
    }
}
