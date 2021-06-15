const api = require("../../../api")

//Helpers
const financialHelper = require('../../../../helpers/financial.helper')
const authHelper = require('../../../../helpers/auth.helper')

//Config
const baseUrl = process.env.BASE_URL_GATEWAY

const junoGateway = {
    getBanks: async () => {
        const token = await authHelper.get()
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['Authorization'] = `Bearer ${token}`

        let request = await api("GET", baseUrl, "/data/banks", {}, config)

        if(request?.response?.status > 399) throw new Error('ERR022')

        return request.data
    },
    getBusiness: async () => {
        const token = await authHelper.get()
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['Authorization'] = `Bearer ${token}`

        let request = await api("GET", baseUrl, "/data/business-areas", {}, config)

        if(request?.response?.status > 399) throw new Error('ERR022')

        return request.data
    },
    getBalance: async (resourceToken) => {      
        const token = await authHelper.get()
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = resourceToken
        config['Authorization'] = `Bearer ${token}`

        let request = await api("GET", baseUrl, "/balance", {}, config)

        if(request?.response?.status > 399) throw new Error('ERR022')

        return request.data
    },
    getDocuments: async (resourceToken) => {
        const token = await authHelper.get()
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = resourceToken
        config['Authorization'] = `Bearer ${token}`

        let request = await api("GET", baseUrl, "/documents", {}, config)

        if(request?.response?.status > 399) throw new Error('ERR022')

        return request.data
    },
    sendDocuments: async (documentId) => {
        const token = await authHelper.get()
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
        config['Authorization'] = `Bearer ${token}`

        let request = await api("POST", baseUrl, `/documents/${documentId}/files`, {}, config)

        if(request?.response?.status > 399) throw new Error('ERR022')

        return request.data
    },
    createAccount: async (data) =>{
        const token = await authHelper.get()
    
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
        config['Authorization'] = `Bearer ${token}`
        
        let request = await api("POST", baseUrl, "/digital-accounts", data, config)

        if(request?.response?.status > 399) throw new Error('ERR018')

        return request
    },
    createCharge: async (data) => {
        const token = await authHelper.get()
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
        config['Authorization'] = `Bearer ${token}`
        
        const chargeToApi = await financialHelper.formatToSendApi(data.user, data.partner, data.product, data.body)
        const request = await api("POST", baseUrl, "/charges", chargeToApi, config)

        if(request?.response?.status > 399) throw new Error('ERR016')

        const chargeToDB = await financialHelper.formatToSendDB(
            data.user, data.product, data.body.paymentType, request.data._embedded.charges[0]
        )
        return chargeToDB
    },
    cancelCharge: async (chargeId) => {
        const token = await authHelper.get()
    
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
        config['Authorization'] = `Bearer ${token}`

        const request = await api("PUT", baseUrl, `/charges/${chargeId}/cancelation`, {}, config)
        
        if(request?.response?.status > 399){
            throw new Error("ERR017")
        }
        return request
    },
    sendPayment: async (data) => {      
        const token = await authHelper.get()
    
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
        config['Authorization'] = `Bearer ${token}`

        const paymentDataToApi = await financialHelper.formatPayment(data.card, data.user, data.body.chargeId)
        let request = await api("POST", baseUrl, "/payments", paymentDataToApi, config)

        if(request?.response?.status > 399){
            throw new Error("ERR019")
        }

        const paymentDataToDB = await financialHelper.formatPaymentToDB(request.data, data.user)
        
        return paymentDataToDB
    },
    cancelPayment: async (paymentId, body) =>{
        const token = await authHelper.get()
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
        config['Authorization'] = `Bearer ${token}`
        
        const request = await api("POST", baseUrl, `/payments/${paymentId}/refunds`, body, config)
        
        if(request?.response?.status > 399){
            throw new Error("ERR020")
        }

        return request.data
    },
    cardTokenization: async (data) => {    
        const token = await authHelper.get()
    
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
        config['Authorization'] = `Bearer ${token}`

        let request = await api("POST", baseUrl, "/credit-cards/tokenization", data, config)
                
        if(request?.response?.status > 399){
            throw new Error("ERR021")
        }

        return request.data
    }
} 

module.exports = junoGateway
