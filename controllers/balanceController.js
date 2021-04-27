const api = require("../core/apiJuno")

const balanceController = {
    getBalance: async (req, res, next) => {
        const config = {
            apiVersion: '2',
            privateToken: '',
            authorization: ''
        }

        let request = await api("GET", "/balance", {}, config)

        res.json(request.data)
    }
} 


module.exports = balanceController
