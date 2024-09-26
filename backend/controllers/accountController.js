const User = require('../models/User')
const bcrypt = require('bcrypt')
const cloudinary = require('../cloudinary/cloudinary')

const accessAccount = async (req, res) => {
    let foundUser
    if(res.locals.email) {
        foundUser = await User.findOne({email: res.locals.email}).exec()
    } else {
        foundUser = await User.findOne({email: req.body.email}).exec()
    }

    if(!foundUser) {
        res.status(401).json({"message": "no user found" });
    } else {
        if(foundUser.email != res.locals.email) {
            return res.status(403).json({
                message: "Forbidden: Token does not belong to the user"
            });
        }
        const adminOptions = [
            'Profile', 
            "Shipping Address",
            'Customer Order',
            'Product Management',
            [
                'Add Product',
                'Manage Product'
            ]
        ]

        const userOptions = [
            'Profile', 
            "Shipping Address",
            [
                'Order',
                'Invoice'
            ]
        ]

        if(foundUser.isAdmin) {
            res.json({
                id: foundUser._id,
                username: foundUser?.username,
                email: foundUser?.email,
                shippingAddress: foundUser?.shippingAddress,
                isAdmin: foundUser.isAdmin,
                avatar: foundUser.avatar,
                options: adminOptions
            })
        } else 
            res.json({
                id: foundUser._id,
                username: foundUser?.username,
                email: foundUser?.email,
                shippingAddress: foundUser?.shippingAddress,
                isAdmin: foundUser.isAdmin,
                avatar: foundUser.avatar,
                options: userOptions
            })
    }

}

const getShippingAddress = async (req, res) => {
    try {
        if(req.query.email === " ") {
            return res.status(400).json({
                message: "Email is empty"
            });
        }
        const foundUser = await User.findOne({email: req.query.email}).exec()

        if(foundUser) {
            if (foundUser.email !== res.locals.email) {
                return res.status(403).json({
                    message: "Forbidden: Token does not belong to the user"
                });
            }
            res.json({
                shippingAddress: foundUser?.shippingAddress
            })
        } else {
            return res.status(404).json({
                message: "User not found"
            });
        }
    } catch (error) {
        console.log(error)
    }
}

const updateAccount = async (req, res) => {
    try {
        const user = await User.findById(req.body.id).exec();
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.email !== res.locals.email) {
            return res.status(403).json({
                message: "Forbidden: Token does not belong to the user"
            });
        }

        let result
        if(req.body?.username && req.body?.username !== '') {
            const duplicateUser = await User.findOne({ username: req.body.username, _id: { $ne: req.body.id } }).exec();
            if (duplicateUser) {
                return res.status(409).json({
                    message: "Username already exists"
                });
            }
            result = await User.updateOne({ _id: req.body.id }, {username: req.body.username}).exec()
        }
        if (req.body?.email && req.body?.email !== '') {
            const duplicateUser = await User.findOne({ email: req.body.email, _id: { $ne: req.body.id } }).exec();
            if (duplicateUser) {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }
            result = await User.updateOne({ _id: req.body.id }, {email: req.body.email}).exec()
        } 
        if(req.body?.password && req.body?.password !== '') {
            const hashPwd = await bcrypt.hash(req.body.password, 10)
            result = await User.updateOne({ _id: req.body.id }, {password: hashPwd}).exec()
        }
        if (req.body?.shippingAddress) {
            result = await User.updateOne({ _id: req.body.shippingAddress.id}, {shippingAddress: req.body.shippingAddress}).exec()
        }
        
        res.status(200).json({
            "message": "Successfully updated!"
        })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
    
}

const addAvatar = async (req, res) => {
    const { avatar, username } = req.body

    try {
        const uploadedImg = await cloudinary.uploader.upload(avatar,
        { 
            upload_preset: 'ava_upload',
            public_id: `${username}_avatar`,
            allowed_formats: ['png', 'jpg', 'jpeg', 'svg', 'ico', 'jfif', 'webp'],
            overwrite: true,
            invalidate: true
        }, 
        async function(error, result) {
            if(error) {
                console.log(error)
                res.status(500)
            } else if (result) {
                const ress = await User.updateOne({ email: req.body.email }, { avatar: result.url }).exec()
                res.status(200).json({
                    "message": "Changed successfully"
                })
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

module.exports = {
    accessAccount,
    getShippingAddress,
    updateAccount,
    addAvatar
}