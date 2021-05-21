const mongoose = require('../core/services/db/mongo.db')
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
        unique: true,
    },
    birthDate:{
        type: Date
    },
    monthlyIncomeOrRevenue:{
        type: Number
    },
    motherName:{
        type: String
    },
    businessArea:{
        type: Number
    },
    linesOfBusiness:{
        type: String
    },
    address:{
        type: Object,
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
        bankNumber:{
            type: String,
            maxlength: 3
        },
        agencyNumber:{
            type: String
        },
        accountNumber:{
            type: Number
        },
        accountType:{
            type: String
        },
        accountHolder:{
            type: Object,
            name:{
                type: String
            },
            document:{
                type: String
            }
        }
    },
    junoAccount:{
        type: Object,
        idAccount:{
            type: String
        },
        type:{
            type: String
        },
        personType:{
            type: String
        },
        status:{
            type: String
        },
        accountNumber:{
            type: String
        },
        resourceToken:{
            type: String
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