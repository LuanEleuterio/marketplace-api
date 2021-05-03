const mongoose = require('../core/db/index')

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
    details:{
        type: Object,
        partnerResource:{
            type: String,
            required: true
        },
        idCustomer:{
            type: String,
            required: true
        },
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Charge = mongoose.model('Charge', ChargeSchema)

module.exports = Charge