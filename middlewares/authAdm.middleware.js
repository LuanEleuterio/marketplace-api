module.exports = (req, res, next) => {
    const userOrPartner = req.userOrPartner

    if(userOrPartner !== "ADMIN"){
        throw new Error("ERR031")
    }
    
    next()
}