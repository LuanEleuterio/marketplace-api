const api = require("../core/apiJuno")
const configAuth = require('../config/auth.json')

const balanceController = {
    getBalance: async (req, res, next) => {
        const config = {
            apiVersion: `${configAuth.apiVersion}`,
            resourceToken: `${configAuth.privateToken}`,
            authorization: `Bearer ${configAuth.token}`
        }

        let request = await api("GET", "/balance", {}, config)

        res.send(request.data)
    }
} 

module.exports = balanceController
