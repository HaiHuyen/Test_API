const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Order = new Schema({
    userId: {type: String, required: true},
    cart: [
        {
            productId: { type: String, required: true},
            name: { type: String, required: true},
            size: { type: String, required: true},
            color: { type: String, required: true},
            quantity: { type: Number, required: true},
            price: { type: Number, required: true },
            total: {type: Number, required: true}
        }
    ],
    totalAmount: {type: Number, required: true},
    totalProduct: {type: Number, required: true},
    status: {type: String, required: true},
    paymentMethod: {
        online: Boolean,
        offline: Boolean
    }
}, { timestamps: true })

module.exports = mongoose.model("Order", Order)