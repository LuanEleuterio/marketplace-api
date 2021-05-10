module.exports = (req, res, next) => {
    const userOrPartner = req.userOrPartner

    if(userOrPartner !== "PARTNER"){
        return res.status(403).send({error: 'Recurso somente para Partners!'})
    }
    
    next()
}