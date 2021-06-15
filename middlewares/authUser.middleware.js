module.exports = (req, res, next) => {
    const userOrPartner = req.userOrPartner

    if(userOrPartner !== "USER"){
        throw new Error("ERR031")
    }
    
    next()
}