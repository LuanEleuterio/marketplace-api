const mongoose = require('../core/services/db/mongo.db')

const OrderSchema = new mongoose.Schema({
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    partner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        default: null
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null
    },
    charge:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Charge',
        default: null
    },
    payment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        default: null
    },
    amount:{
        type: Number,
        default: 0
    },
    status:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date
    }
})

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order