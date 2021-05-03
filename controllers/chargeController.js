const api = require("../core/apiJuno")
const configAuth = require('../config/auth.json')

const chargeController = {
    createCharges: async (req, res, next) => {
     
        const config = {
            apiVersion: `${configAuth.apiVersion}`,
            resourceToken: `${configAuth.privateToken}`,
            authorization: `Bearer ${configAuth.token}`
        }

        try{
            let request = await api("POST", "/charges", req.body, config)

            return res.send(request.data)
        } catch(err){
            return res.send(err)
        }
    }
}

module.exports = chargeController