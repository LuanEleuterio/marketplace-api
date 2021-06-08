const mongoose = require('../core/services/db/mongo.db')

const ChargeSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true
    },
    code:{
        type: String,
        required: true
    },
    dueDate:{
        type: Date,
        required: true
    },
    paymentType:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    discountAmount:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    card:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
    },
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
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

const Charge = mongoose.model('Charge', ChargeSchema)

module.exports = Charge