module.exports = (req, res, next) => {
    const userOrPartner = req.userOrPartner

    if(userOrPartner !== "PARTNER"){
        throw new Error("ERR031")
    }
    
    next()
}