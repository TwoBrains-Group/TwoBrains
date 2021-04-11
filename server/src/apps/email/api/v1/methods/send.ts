import {Method, MethodRes, Req} from '@apps/_base/Method'
import nodemailer from 'nodemailer'

class Send extends Method {
    async run(req: Req, user: any): Promise<MethodRes> {
        const {params} = req
        const {id: loggedInUserId} = user

        const {to} = params

        const testAccount = await nodemailer.createTestAccount()
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        })

        const info = await transporter.sendMail({
            from: 'MR. KEK <mrkek@lolkek.com>',
            to,
            subject: 'Kill yourself please',
            text: 'AAAAAA',
            html: '<b>Lol KEK CHEBURECK</b>',
        })

        console.log('Message sent:', info.messageId)

        console.log('preview:', nodemailer.getTestMessageUrl(info))

        return {}
    }
}

export default new Send({
    name: 'send',
    auth: false,
})
