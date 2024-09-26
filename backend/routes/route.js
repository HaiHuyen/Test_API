require('dotenv').config()
const registerController = require('../controllers/registerController')
const authController = require('../controllers/authController')
const accountController = require('../controllers/accountController')
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
const loginLimiter = require('../middleware/loginLimiter')
const verifyJWT = require('../middleware/verifyJWT')

function route(app) {
    //manage account
    app.put('/account/update', verifyJWT, accountController.updateAccount);
    app.get('/account/getAddress', verifyJWT, accountController.getShippingAddress);
    app.post('/account', verifyJWT, accountController.accessAccount);
    app.post('/set_ava', verifyJWT, accountController.addAvatar);

    //manage product
    app.get('/products/:id', productController.getProduct)
    app.put('/manage_product/:id', verifyJWT, productController.updateProduct)
    app.delete('/manage_product/:id', verifyJWT, productController.deleteProduct)
    app.get('/products', productController.getAllProduct)
    app.post('/account/addProduct', verifyJWT, productController.addProduct)
    app.post('/getReview', verifyJWT, productController.getReview)

    // manage the cart
    app.post('/products/addCart', verifyJWT, cartController.addProduct)
    app.post('/cart', verifyJWT, cartController.getProduct)
    app.post('/cart/delete', verifyJWT, cartController.deleteProduct)
    app.post('/cart/finish_order', verifyJWT, cartController.finishOrder)
    app.post('/cart/update', verifyJWT, cartController.updateProduct)

    // authentication
    app.post('/register', registerController)
    app.post('/signin', loginLimiter, authController.login)
    app.post('/refresh', authController.refresh)
    app.get('/logout', authController.logout)
    app.post('/sendOTP', authController.sendOTP)
    app.get('/checkOTP/:token', authController.checkOTP)
    app.put('/resetPwd/:token/:userId', authController.resetPassword)

    // manage order
    app.post('/order/createOrder', verifyJWT, orderController.createOrder)
    app.get('/order/getOrder/:userId', verifyJWT, orderController.getOrder) //user's orders
    app.get('/order/getOrderedItem/:userId', verifyJWT, orderController.getOrderedItem) //user's invoice
    app.get('/order/getAllOrder', verifyJWT, orderController.getAllOrder) //admin: all user's orders
    app.get('/order/getDetailOrder/:id', verifyJWT, orderController.getDetailOrder) //user detail order
    app.get('/order/getOrderAddr', verifyJWT, orderController.getOrderAddr) //get order's addrs: user + admin
    app.post('/order/updateStatus/:id', verifyJWT, orderController.updateStatus) //user + admin
    app.post('/order/cancelOrder', verifyJWT, orderController.cancelOrder) //user
    app.post('/order/addReview', verifyJWT, orderController.addReview) //user

    //search
    app.get('/search/:search', productController.searchProduct)
}

module.exports = route