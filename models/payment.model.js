const mongoose = require('../core/services/db/mongo.db')

const PaymentSchema = new mongoose.Schema({
    transactionId:{
        type: String,
        required: true
    },
    installments:{
        type: Number,
        required: true
    },
    payment:[{
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
        fee:{
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
    }],
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cancelDetails:[{
        transactionId: {
            type: String
        },
        installments: {
            type: Number
        },
        refunds: [{
            id:{
                type: String
            },
            chargeId:{
                type: String
            },
            releaseDate:{
                type: Date
            },
            paybackDate:{
                type: Date
            },
            status:{
                type: String
            }
        }],
    }],
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Payment = mongoose.model('Payment', PaymentSchema)

module.exports = Payment