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
        required: true
    },
    status:{
        type: Boolean,
        required: true
    },
    partner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner",
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product