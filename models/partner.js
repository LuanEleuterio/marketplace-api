const mongoose = require('../core/db/index')
const bcrypt = require('bcryptjs')

const PartnerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        unique: true,
        type: String,
        required: true
    },
    phone:{
        unique: true,
        type: String,
        required: true
    },
    document:{
        type: String,
        required: true,
        unique: true,
    },
    birthDate:{
        type: Date,
        required: true
    },
    monthlyIncomeOrRevenue:{
        type: Number,
        required: true
    },
    motherName:{
        type: String
    },
    businessArea:{
        type: Number,
        required: true
    },
    address:{
        type: Object,
        required: true,
        street:{
            type: String,
            required: true
        },
        number:{
            type: String,
            required: true
        },
        city:{
            type: String,
            required: true
        },
        state:{
            type: String,
            required: true,
            maxLength: 2
        },
        postCode:{
            type: String,
            required: true,
            maxlength: 8
        }
    },
    bankAccount:{
        type: Object,
        required: true,
        bankNumber:{
            type: String,
            required: true,
            maxlength: 3
        },
        agencyNumber:{
            type: String,
            required: true
        },
        accountNumber:{
            type: Number,
            required: true
        },
        accountType:{
            type: String,
            required: true
        },
        accountHolder:{
            type: Object,
            required: true,
            name:{
                type: String,
                required: true
            },
            document:{
                type: String,
                required: true
            }
        }
    },
    junoAccount:{
        type: Object,
        idAccount:{
            type: String,
            required: true
        },
        type:{
            type: String,
            required: true
        },
        personType:{
            type: String,
            required: true
        },
        status:{
            type: String,
            required: true
        },
        accountNumber:{
            type: String,
            required: true
        },
        resourceToken:{
            type: String,
            required: true
        },
        createdAt:{
            type: Date
        }

    },
    password:{
        type: String,
        required: true,
        select: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

PartnerSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
})

const Partner = mongoose.model('Partner', PartnerSchema)

module.exports = Partner