const api = require("../core/apiJuno")
const configAuth = require('../config/auth.json')

const tokenizationController = {
    createTokenCard: async (req, res, next) => {
    
        const config = {
            apiVersion: `${configAuth.apiVersion}`,
            resourceToken: `${configAuth.privateToken}`,
            authorization: `Bearer ${configAuth.token}`
        }

        try{
            let request = await api("POST", "/credit-cards/tokenization", req.body, config)

            return res.send(request.data)
        } catch(err){
            return res.send(err)
        }
    }
}

module.exports = tokenizationController