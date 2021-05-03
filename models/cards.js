const mongoose = require('../core/db/index')

const CardsSchema = new mongoose.Schema({
    creditCardId: {
        type: String,
        required: true
    },
    lastFourNumber: {
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