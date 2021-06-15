const mongoose = require('../core/services/db/mongo.db')

const OrderSchema = new mongoose.Schema({
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    details:[{
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
        shippingValue:{
            type: Number,
            default: 0
        },
        status:{
            type: String,
            required: true
        }
    }],
    status:{
        type: String,
        required: true,
        default: "ACTIVE"
    },
    date: {
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date
    },
    deletedAt:{
        type: Date
    },
    deleted:{
        type: Boolean,
        default: false
    }
})

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order