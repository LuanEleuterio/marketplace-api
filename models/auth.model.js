const mongoose = require('../core/services/db/mongo.db')

const AuthsSchema = new mongoose.Schema({
    id:{
        type: String,
        default: 1
    },
    access_token: {
        type: String,
        required: true
    },
    token_type: {
        type: String,
        required: true
    },
    expires_in: {
        type: String,
        required: true
    },
    expires_milli: {
        type: String,
        required: true
    },
    expires_date: {
        type: Date,
        required: true
    },
    scope: {
        type: String,
        required: true
    },
    jti: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Auths = mongoose.model('Auths', AuthsSchema)

module.exports = Auths