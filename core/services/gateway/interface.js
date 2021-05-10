const vendor = process.env.GATEWAY_NAME
const gateway = require(`./vendor/${vendor}.vendor`)

const interface = {
    getBanks: async () =>{
        return gateway.getBanks()
    },
    getBusiness: async () =>{
        return gateway.getBusiness()
    },
    getDocuments: async () =>{
        return gateway.getDocuments()
    },
    getBalance: async () =>{
        return gateway.getBalance()
    },
    createCharge: async (data) =>{
        return gateway.createCharge(data)
    },
    cancelCharge: async (data) =>{
        return gateway.cancelCharge(data)
    },
    sendPayment: async (data) =>{
        return gateway.sendPayment(data)
    },
    cardTokenization: async (data) =>{
        return gateway.cardTokenization(data)
    },
}

module.exports = interface