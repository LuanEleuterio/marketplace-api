const mongoose = require('../core/services/db/mongo.db')

const CardsSchema = new mongoose.Schema({
    creditCardId: {
        type: String,
        required: true
    },
    last4CardNumber: {
        type: String,
        required: true
    },
    expirationMonth: {
        type: String,
        required: true
    },
    expirationYear: {
        type: String,
        required: true
    },
    holderName: {
        type: String,
        required: true
    },
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    active:{
        type: Boolean,
        default: true
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


const Cards = mongoose.model('Cards', CardsSchema)

module.exports = Cards