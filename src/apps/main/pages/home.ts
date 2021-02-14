import {Page, PageProps, Request, Response} from '@apps/base/Page'
import {PageData} from '@utils/storage'
import {QueryReturnType} from "@modules/db/Pool";

class Home extends Page {
    constructor(props: PageProps) {
        super(props)
    }

    async run(req: Request, res: Response): Promise<PageData> {
        const result = await this.query('kek', {param: 'kek'}, {
            returnType: QueryReturnType.ROW,
            returnField: 'kek'
        })

        this.log.info(`result: ${JSON.stringify(result, null, 2)}`)

        return {
            kek: result,
        }
    }
}

export default new Home({
    route: '/',
})
