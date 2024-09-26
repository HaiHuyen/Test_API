const Cart = require('../models/Cart')
const User = require('../models/User')
const bcrypt = require('bcrypt')

const registerController = async (req, res) => {
    const {user, email, pwd} = req.body

    if(!user || !pwd || !email) {
        return res.status(400).json({
            'message': "Please fill in all essential information"
        }) //bad request
    }

    const duplicate = await User.findOne({username: user}).exec()
    if(duplicate) return res.sendStatus(409) //conflict

    try {
        const hashPwd = await bcrypt.hash(pwd, 10)
        const newUser = await User.create({
            'username': user,
            'email': email,
            'password': hashPwd,
            'shippingAddress': {}
        })

        const newCart = await Cart.create({
            'userId': newUser._id,
            'cart': []
        })

        res.status(201).json({
            "message": "Created sucessfully"
        })
    } catch(err) {
        res.status(500).json({
            "message": err.message
        })
    }
}

module.exports = registerController