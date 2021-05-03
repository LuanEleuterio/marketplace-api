const mongoose = require('../core/db/index')

const PaymentSchema = new mongoose.Schema({
    transactionId:{
        type: String,
        required: true
    },
    installments:{
        type: number,
        required: true
    },
    payment:{
        type: Object,
        id:{
            type: String,
            required: true
        },
        charge:{
            type: String,
            required: true
        },
        date:{
            type: Date,
            required: true
        },
        amount:{
            type: Number,
            required: true
        },
        type:{
            type: String,
            required: true
        },
        status:{
            type: String,
            required: true
        }        
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

const Payment = mongoose.model('Payment', PaymentSchema)

module.exports = Payment