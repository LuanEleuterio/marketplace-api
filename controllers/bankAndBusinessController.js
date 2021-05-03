const api = require("../core/apiJuno")
const configAuth = require('../config/auth.json')

const bankAndBusinessController = {
    getBanks: async (req, res, next) => {
        const config = {
            apiVersion: `${configAuth.apiVersion}`,
            authorization: `Bearer ${configAuth.token}`
        }

        try{
            let request = await api("GET", "/data/banks", {}, config)

            return res.send(request.data)
        } catch(err){
            return res.send(err)
        }
    },
    getBusiness: async (req, res, next) => {
        const config = {
            apiVersion: `${configAuth.apiVersion}`,
            authorization: `Bearer ${configAuth.token}`
        }

        try{
            let request = await api("GET", "/data/business-areas", {}, config)

            return res.send(request.data)

        } catch(err){
            return res.send(err)
        }
    }
}

module.exports = bankAndBusinessController