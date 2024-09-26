const Order = require('../models/Order');
const User = require('../models/User')
const Cart = require('../models/Cart');
const Product = require('../models/Product')

const createOrder = async (req, res) => {
    function isValidPaymentMethod(payment) {
        if (typeof payment !== 'object' || payment === null) {
            return false;
        }
        if (!payment.hasOwnProperty('online') || !payment.hasOwnProperty('offline')) {
            return false;
        }
        if (typeof payment.online !== 'boolean' || typeof payment.offline !== 'boolean') {
            return false;
        }
        return true;
    }
    // create order
    try {
        const foundUser = await User.findOne({ email: req.body.email}).exec();
        if(!foundUser) return res.status(401).json({
            "message": "no user found"
        });

        if(req.body.cart.length <= 0) {
            res.status(400).json({
                "message": "The cart is empty"
            })
        }
        if (isNaN(req.body.totalAmount) || isNaN(req.body.totalProduct) || !isValidPaymentMethod(req.body.paymentMethod)) {
            res.status(400).json({ "message": 'Invalid input' });
        }

        const foundCart = await Cart.findOne({ userId: foundUser._id }).exec();    
        if(!foundCart) {
            res.status(404).json({
                "message": "No cart found"
            })
        }

        //delete selected item from the cart
        for(let purchase_id of req.body.deletedArr) {
            const itemIndex = foundCart.cart.findIndex(item => item._id.toString() === purchase_id)
            
            if(itemIndex !== -1) {
                foundCart.cart.splice(itemIndex, 1)
                await foundCart.save();
            } else {
                res.status(404).json({
                    "message": "No product found"
                })
            }
        }

        await Order.create({
            "userId": foundUser._id,
            "cart": req.body.cart,
            "totalAmount": req.body.totalAmount,
            "totalProduct": req.body.totalProduct,
            "status": req.body.status,
            "paymentMethod": req.body.paymentMethod
        })

        res.status(201).json({
            "message": "Created sucessfully"
        })
    } catch (error) {
        res.status(500).json({
            "message": error.message
        })
    }
}

const getAllOrder = async (req, res) => {
    const page = req.query.page || 1
    const skip = (page - 1) * process.env.ITEMS_PER_PAGE
    try {
        const countPromise = await Order.estimatedDocumentCount();
        const allOrdersPromise = await Order.find({}, 'userId totalProduct createdAt').limit(process.env
            .ITEMS_PER_PAGE).skip(skip).sort({ createdAt: -1 }).exec();
        
        const [count, allOrders] = await Promise.all([countPromise, allOrdersPromise])
        const pageCount = count / process.env.ITEMS_PER_PAGE
        
        res.json({
            allOrders,
            pagination: {
                count, 
                pageCount
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(204).json({
            'message': 'No orders found'
        })
    }
}

const getOrder = async (req, res) => {
    try {
        const foundOrder = await Order.find({userId: req.params.userId}, 'cart totalAmount status createdAt ').sort({ createdAt: -1 }).exec();

        if(foundOrder) {
            res.send(foundOrder)
        } else {
            res.status(404).json({
                "message": "no order found"
            })

        }
    } catch (error) {
        console.log(error)
    }
    
}

const getOrderedItem = async (req, res) => {
    const foundOrder = await Order.find({userId: req.params.userId, status: 'Confirm'}, 'cart totalAmount totalProduct status').exec();

    if(foundOrder) {
        res.send(foundOrder)
    } else {
        res.status(404).json({
            "message": "no order found"
        })

    }
}

const getDetailOrder = async (req, res) => {
    const foundOrder = await Order.findById({_id: req.params.id});
    
    if(foundOrder) {
        res.send(foundOrder)
    } else {
        res.status(404).json({
            "message": "no order found"
        })

    }
}

const getOrderAddr = async (req, res) => {
    try {
        const foundUser = await User.findById({_id: req.params.userId});
        res.send(foundUser?.shippingAddress)
    } catch (error) {
        res.status(500)
    }
}

const updateStatus = async (req, res) => {
    const foundOrder = await Order.findById({_id: req.params.id});

    if(req.body?.status) {
        foundOrder.status = req.body.status
        await foundOrder.save();

        if(req.body.cart) {
            for(const item of req.body.cart) {
                const result = await Product.updateOne(
                    { _id: item.productId },
                    { $inc: { sold: parseInt(item.quantity) } }
                ).exec();  
            }
        }

        res.status(200).json({
            "message": "Updated successfully"
        })
    } else {
        res.status(404) 
    }
}

const cancelOrder = async (req, res) => {
    if(req.body.cart.length <= 0) {
        res.status(400).json({ message: "The cart is empty" });
    }
    try {
        await Order.deleteOne({_id: req.body.orderId});

        for (const cartItem of req.body.cart) {
            const foundProduct = await Product.findById(cartItem.productId);
            if (foundProduct) {
                foundProduct.countInStock += cartItem.quantity;
                await foundProduct.save();
            } else {
                res.status(404).json({ message: "Product not found" });
            }
        }

        res.status(200).json({
            "message": "Delete successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: "Order not found" });
    }
    
}

const addReview =  async (req, res) => {
    
    if(req.body?.productId) {
        const foundProduct = await Product.findById({_id: req.body.productId}).lean().exec()
        
        const review = {
            username: req.body.username,
            userId: req.body.userId,
            content: req.body.content,
            mark: req.body.mark,
            dayCreated: req.body.dayCreated
        }
    
        const reviews = [...foundProduct.reviews, review]
    
        try {
            const result = await Product.updateOne({ _id: req.body.productId }, {reviews: reviews}).exec()
    
            res.status(200).json({
                "message": "Successfully updated!"
            })
        } catch (error) {
            console.log(error)
            return res.status(204).json({
                'message': 'No products found'
            })
        }
    }
    
}

module.exports = {
    createOrder,
    getAllOrder,
    getOrder,
    getOrderedItem,
    getDetailOrder,
    getOrderAddr,
    updateStatus,
    cancelOrder,
    addReview
}