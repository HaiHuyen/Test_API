const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, //1 minute
    max: 5, //each IP can make 5 login request per 'window' per minute
    message: {
        message: 'Too many attempts from this IP, please try again after 1 minute'
    },
    handler: (req, res, next, options) => {
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, //return rete limit info in the "RateLimit" headers
    legacyHeaders: false //disable the 'x-ratelimit' headers
})

module.exports = loginLimiter