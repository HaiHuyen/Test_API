const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Cart = new Schema({
    userId: {type: String, required: true},
    cart: [
        {
            name: { type: String, required: true},
            type: { type: String, required: true},
            size: { type: String, required: true},
            color: { type: String, required: true},
            quantity: { type: Number, required: true},
            price: { type: Number, required: true },
            image: { type: String },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        }
        
    ]
})

module.exports = mongoose.model("Cart", Cart)