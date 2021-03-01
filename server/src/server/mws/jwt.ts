import jwt from 'express-jwt'

export default jwt({
    algorithms: ['HS256'],
    secret: Buffer.from(process.env.JWT_SECRET!, 'base64'),
    // credentialsRequired: false,
    getToken: req => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1].trim();
        }
        console.log(`Token is NULL!!!`)
        return null;
    }
}).unless({
    path: [
        /.*\/auth.*/g
    ]
})
