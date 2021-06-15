const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader){
        throw new Error('ERR027')
    }

    const parts = authHeader.split(' ')
    
    if(!parts.length === 2){
        throw new Error('ERR028')
    }

    const [ bearer , token ] = parts

    if(!/^Bearer$/i.test(bearer)){
        throw new Error('ERR029')
    }

    jwt.verify(token, process.env.SECRET_WORD, (error, decoded) => {
        if(error) throw new Error('ERR030')

        req.userId = decoded.id
        req.userOrPartner = decoded.userOrPartner
        return next()
    })
}