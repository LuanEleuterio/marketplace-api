const mongoose = require('../core/services/db/mongo.db')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        unique: true,
        type: String,
        required: true
    },
    document:{
        unique: true,
        type: String,
        required: true
    },
    dtnasc:{
        type: Date,
        required: true
    },
    phone:{
        type: String,
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
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cards'
    }], 
    password:{
        type: String,
        required: true,
        select: false
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
    },
    status:{
        type: String
    }
})

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User