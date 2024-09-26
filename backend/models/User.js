const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    "username": { type: String, required: true},
    "email": { type: String, required: true},
    "password": { type: String, required: true},
    "isAdmin": { type: Boolean, required: true, default: false},
    "refreshToken": {type: String},
    "shippingAddress": {
        fullName: { type: String, required: true, default: ' ' },
        tel: { type: String, required: true, default: ' ' },
        city: { type: String, required: true, default: ' ' },
        address: { type: String, required: true, default: ' ' }
    },
    "avatar": { type: String, default: '' }
})

module.exports = mongoose.model('User', userSchema)