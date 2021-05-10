module.exports = (req, res, next) => {
    const userOrPartner = req.userOrPartner

    if(userOrPartner !== "USER"){
        return res.status(403).send({error: 'Recurso somente para usuários!'})
    }
    
    next()
}