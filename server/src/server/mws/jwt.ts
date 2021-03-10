import jwt from 'express-jwt'

export default jwt({
    algorithms: ['HS256'],
    secret: Buffer.from(process.env.JWT_SECRET!, 'base64'),
    // credentialsRequired: false,
    getToken: req => {
        console.log('Token:', req.headers.authorization!.split(' ')[1].trim())
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1].trim()
        }
        return null
    },
}).unless({
    path: [
        /.*\/auth.*/g,
        /\/public\/.*/g,
    ],
})
