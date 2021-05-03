const mongoose = require('../core/db/index')
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

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User