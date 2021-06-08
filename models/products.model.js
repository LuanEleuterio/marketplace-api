const mongoose = require('../core/services/db/mongo.db')

const ProductSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    qtd:{
        type: Number,
        required: true
    },
    img_url:{
        type: String,
        default: "placeholder.jpg"
    },
    active:{
        type: Boolean,
        required: true,
        default: true
    },
    details: {
        type: Object,
        marca:{
            type: String,
            required: true
        },
        model:{
            type: String,
            required: true
        },
        capacity:{
            type: String,
            required: true
        },
        color:{
            type: String,
            required: true
        },
        weight:{
            type: String,
            required: true
        },
        dimension:{
            type: Object,
            height: {
                type: String,
                required: true
            },
            width: {
                type: String,
                required: true
            },
            comprimento: {
                type: String,
                required: true
            }
        },
        manufacturer:{
            type: String,
            required: true
        },
        used:{
            type: Boolean,
            required: true,
            default: false
        },
        otherDetails:{
            type: String,
            required: true
        }
    },
    partner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner",
        required: true
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

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product