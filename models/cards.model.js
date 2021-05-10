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
    idCustomer:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Cards = mongoose.model('Cards', CardsSchema)

module.exports = Cards