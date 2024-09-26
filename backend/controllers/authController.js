const User = require('../models/User')
const Cart = require('../models/Cart')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var nodemailer = require('nodemailer');

const login = async (req, res) => {
    const { user, pwd } = req.body
    
    if(!user || !pwd) {
        return res.status(400).json({
            "message": "User and password are required"
        })
    }

    const foundUser = await User.findOne({email: user}).exec()
    if(!foundUser) return res.status(401).json({
        "message": "no user found"
    });
    
    //if the user exist
    const match = await bcrypt.compare(pwd, foundUser.password)

    if(match) {
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": foundUser.email,
                    "isAdmin": foundUser.isAdmin
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '1d'
            }
        )

        const refreshToken = jwt.sign(
            {
                "UserInfo": {
                    "email": foundUser.email
                }
            },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: "30d"}
        )
        const foundCart = await Cart.findOne({ userId: foundUser._id }).lean().exec()
        foundUser.refreshToken = refreshToken
        const result = await foundUser.save()

        res.cookie('jwt', refreshToken, {
            // domain: 'https://clothes-shop-api.onrender.com',
            httpOnly: true, 
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000
        });

        if(foundCart) {
            res.status(200).send({ user, accessToken, refreshToken, cartLength: foundCart.cart.length })
        } else {
            if(foundUser.isAdmin === true) res.status(201).send({ user, accessToken, refreshToken, cartLength: 0 })
        }
        
    } else {
        res.status(401).send({
            "message": "Invalid email or password"
        }) //unauthorized
    }
}

const refresh = async (req, res) => {
    const cookies = req.cookies

    if(!cookies?.jwt) return res.status(401).json({
        "message": "Unauthorized"
    })
    
    const refreshToken = cookies.jwt
    // const refreshToken = req.body.refreshToken
    if(!refreshToken) return res.status(401).json({
        "message": "Unauthorized"
    })
    const foundUser = await User.findOne({refreshToken}).exec()
    const foundCart = await Cart.findOne({ userId: foundUser._id }).exec()

    if(!foundUser) return res.status(401).json({"message": "Unauthorized"})

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.status(403).json({"message": "Forbidden"})
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": decoded.UserInfo.email,
                    "isAdmin": foundUser.isAdmin
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d"}
        )

        if(foundCart) {
            res.json({
                email: decoded.UserInfo.email,
                accessToken: accessToken,
                cartLength: foundCart.cart.length
            })
        } else {
            res.json({
                email: decoded.UserInfo.email,
                accessToken: accessToken,
                cartLength: 0
            })
        }
    })
    
}

const logout = async (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) res.sendStatus(204)

    //clear the refresh token in the database
    const refreshToken = cookies.jwt;

    //new
    // const refreshToken = req.body.token
    if(!refreshToken) res.sendStatus(204)
    const update = await User.updateOne({ refreshToken: refreshToken }, { refreshToken: '' }).exec()

    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' })
    res.status(200)
}

const sendOTP = async (req, res) =>  {
    try {
        const foundUser = await User.findOne({email: req.body.email}).exec()
        if(!foundUser) return res.status(401).json({"message": "No user found"})

        const token = jwt.sign({ email: req.body.email, id: foundUser._id }, process.env.OTP_TOKEN, {
            expiresIn: "5m"
        })
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        try {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.EMAIL_ADD,
                  pass: process.env.EMAIL_PWD
                }
            });
            const string = `This is your reset OTP ${randomNumber}. It will expire in 5 minutes`
            var mailOptions = {
                from: process.env.EMAIL_ADD,
                to: req.body.email,
                subject: 'Sending OTP to reset your Password',
                text: string,
            };
              
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });
            res.status(200).send({
                token: token,
                OTP: randomNumber
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({
                "message": "Cannot send the OTP email"
            })
        }
        
    } catch (error) {
        console.log(error)
    }
}

const checkOTP = async (req, res) => {
    jwt.verify(req.params.token, process.env.OTP_TOKEN, (err, decoded) => {
        if(err) return res.status(403).json({"message": "Code is expired"}) 
        else {
            const newToken = jwt.sign({ email: decoded.email, id: decoded.id }, process.env.OTP_TOKEN, {
                expiresIn: "15m"
            })
            res.send({
                token: newToken,
                userId: decoded.id
            })
        }
    })
}

const resetPassword = async (req, res) => {
    jwt.verify(req.params.token, process.env.OTP_TOKEN, async (err, decoded) => {
        if(err) return res.status(403).json({"message": "Code is expired or invalid"}) 
        else {  
            const hashPwd = await bcrypt.hash(req.body.pwd, 10)
            try {
                const result = await User.updateOne({ _id: req.params.userId }, {password: hashPwd}).exec()
                res.status(200).json({
                    "message": "Successfully reset!"
                })
            } catch (error) {
                console.log(error)
                return res.status(401).json({
                    "message": "no user found"
                });
            }
            
        }
    })
}

module.exports = { 
    login, 
    refresh,
    logout,
    sendOTP,
    checkOTP,
    resetPassword,
}