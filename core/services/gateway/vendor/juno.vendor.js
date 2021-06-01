const api = require("../../../api")

//Helpers
const financialHelper = require('../../../../helpers/financial.helper')
const authHelper = require('../../../../helpers/auth.helper')

//Config
const baseUrl = process.env.BASE_URL_GATEWAY

const junoGateway = {
    getBanks: async () => {
        try{
            const token = await authHelper.get()
            const config = {}
            config['X-Api-Version'] = process.env.API_VERSION
            config['Authorization'] = `Bearer ${token}`

            let request = await api("GET", baseUrl, "/data/banks", {}, config)
            return request.data
        } catch(err){
            return err
        }
    },
    getBusiness: async () => {
        try{
            const token = await authHelper.get()
            const config = {}
            config['X-Api-Version'] = process.env.API_VERSION
            config['Authorization'] = `Bearer ${token}`

            let request = await api("GET", baseUrl, "/data/business-areas", {}, config)
            return request.data
        } catch(err){
            return err
        }
    },
    getBalance: async (resourceToken) => {      
        try{
            const token = await authHelper.get()
            const config = {}
            config['X-Api-Version'] = process.env.API_VERSION
            config['X-Resource-Token'] = resourceToken
            config['Authorization'] = `Bearer ${token}`

            let request = await api("GET", baseUrl, "/balance", {}, config)
            return request.data
        } catch(err){
            return err
        }
    },
    getDocuments: async (resourceToken) => {
        try{
            const token = await authHelper.get()
            const config = {}
            config['X-Api-Version'] = process.env.API_VERSION
            config['X-Resource-Token'] = resourceToken
            config['Authorization'] = `Bearer ${token}`

            let request = await api("GET", baseUrl, "/documents", {}, config)
            return request.data
        } catch(err){
            return err
        }
    },
    sendDocuments: async (documentId) => {
        try{
            const token = await authHelper.get()
            const config = {}
            config['X-Api-Version'] = process.env.API_VERSION
            config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
            config['Authorization'] = `Bearer ${token}`

            let request = await api("POST", baseUrl, `/documents/${documentId}/files`, {}, config)
            return request.data
        } catch(err){
            return err
        }
    },
    createAccount: async (data) =>{
        try{
            const token = await authHelper.get()
        
            const config = {}
            config['X-Api-Version'] = process.env.API_VERSION
            config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
            config['Authorization'] = `Bearer ${token}`
    

            let request = await api("POST", baseUrl, "/digital-accounts", data, config)
            return request
        } catch(err){
            return err
        }
    },
    createCharge: async (data) => {
        const token = await authHelper.get()
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
        config['Authorization'] = `Bearer ${token}`

        try{
            const chargeToApi = await financialHelper.formatToSendApi(data.user, data.partner, data.product, data.body)
            const request = await api("POST", baseUrl, "/charges", chargeToApi, config)
            const chargeToDB = await financialHelper.formatToSendDB(
                data.user, data.product, data.body.paymentType, request.data._embedded.charges[0]
            )
            return chargeToDB
        } catch(err){
            return err
        }
    },
    cancelCharge: async (chargeId) => {
        try{
            const token = await authHelper.get()
        
            const config = {}
            config['X-Api-Version'] = process.env.API_VERSION
            config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
            config['Authorization'] = `Bearer ${token}`

            const request = await api("PUT", baseUrl, `/charges/${chargeId}/cancelation`, {}, config)
            if(request.status >= 400){
                return request.data
            }
            return request
        } catch(err){
            return err
        }
    },
    sendPayment: async (data) => {
        const token = await authHelper.get()
        
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
        config['Authorization'] = `Bearer ${token}`
       
        try{
            const paymentDataToApi = await financialHelper.formatPayment(data.card, data.user, data.body.chargeId)
            let request = await api("POST", baseUrl, "/payments", paymentDataToApi, config)
            const paymentDataToDB = await financialHelper.formatPaymentToDB(request.data, data.user)
            
            return paymentDataToDB
        } catch(err){
            console.log(err)
            return err
        }
    },
    cancelPayment: async (paymentId, body) =>{
        
        try {
            const token = await authHelper.get()
            const config = {}
            config['X-Api-Version'] = process.env.API_VERSION
            config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
            config['Authorization'] = `Bearer ${token}`
            
            const request = await api("POST", baseUrl, `/payments/${paymentId}/refunds`, body, config)
            return request.data
        }catch(err){
            return err.stack
        }
    },
    cardTokenization: async (data) => {    
        const token = await authHelper.get()
        
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
        config['Authorization'] = `Bearer ${token}`

        try{
            let request = await api("POST", baseUrl, "/credit-cards/tokenization", data, config)
          
            return request.data
        } catch(err){
            return err
        }
    }
} 

module.exports = junoGateway
