const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader){
        res.status(401).send({error: 'No token provided'})
    }

    const parts = authHeader.split(' ')
    
    if(!parts.length === 2){
        res.status(401).send({error: 'Token error'})
    }

    const [ bearer , token ] = parts

    if(!/^Bearer$/i.test(bearer)){
        res.status(401).send({error: 'Token malformatted'})
    }

    jwt.verify(token, process.env.SECRET_WORD, (error, decoded) => {
        if(error) return res.status(401).send({error: "Token invalid"})

        req.userId = decoded.id
        req.userOrPartner = decoded.userOrPartner
        return next()
    })
}