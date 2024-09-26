const mongoose = require('mongoose')

async function connectDB() {
    try {
        mongoose.connect(process.env.DATA_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        console.log("Connect to mongoDB")
    } catch(err) {
        console.error(err)
    }
}

module.exports = connectDB