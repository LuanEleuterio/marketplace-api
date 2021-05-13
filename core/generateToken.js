const jwt = require('jsonwebtoken')
const authConfig = require("../config/auth.json")

const generateToken = (params) => {
    return jwt.sign(params, process.env.SECRET_WORD, {
        expiresIn: 86400,
    })
}

module.exports = generateToken