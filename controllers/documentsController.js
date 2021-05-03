const api = require("../core/apiJuno")
const configAuth = require('../config/auth.json')

const documentsController = {
    getDocuments: async (req, res, next) => {
        const config = {
            apiVersion: `${configAuth.apiVersion}`,
            resourceToken: `A7D8EE5B8E8476FE9E694CADC65174058383B98B2484170AB20CF429643F3482`,
            authorization: `Bearer ${configAuth.token}`
        }

        let request = await api("GET", "/documents", {}, config)

        res.send(request.data)
    }
} 

module.exports = documentsController
