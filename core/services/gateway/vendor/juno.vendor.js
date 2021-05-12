const api = require("../../../api")
const configAuth = require('../../../../config/auth.json')

//Helpers
const financialHelper = require('../../../../helpers/financial.helper')

//Config
const baseUrl = 'https://sandbox.boletobancario.com/api-integration'

const junoGateway = {
    getBanks: async (req, res, next) => {
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['Authorization'] = `Bearer ${configAuth.authentication.token}`

        try{
            let request = await api("GET", baseUrl, "/data/banks", {}, config)
            return request.data
        } catch(err){
            return err
        }
    },
    getBusiness: async (req, res, next) => {
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['Authorization'] = `Bearer ${configAuth.authentication.token}`

        try{
            let request = await api("GET", baseUrl, "/data/business-areas", {}, config)
            return request.data
        } catch(err){
            return err
        }
    },
    getBalance: async () => {
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
        config['Authorization'] = `Bearer ${configAuth.authentication.token}`
        
        try{
            let request = await api("GET", baseUrl, "/balance", {}, config)
            return request.data
        } catch(err){
            return err
        }
    },
    getDocuments: async (req, res, next) => {
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = `A7D8EE5B8E8476FE9E694CADC65174058383B98B2484170AB20CF429643F3482`
        config['Authorization'] = `Bearer ${configAuth.authentication.token}`
        
        try{
            let request = await api("GET", baseUrl, "/documents", {}, config)
            return request.data
        } catch(err){
            return err
        }
    },
    sendDocuments: async (documentId) => {
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
        config['Authorization'] = `Bearer ${configAuth.authentication.token}`

        try{
            let request = await api("POST", baseUrl, `/documents/{documentId}/files`, {}, config)
            return request.data
        } catch(err){
            return err
        }
    },
    createAccount: async (data) =>{
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
        config['Authorization'] = `Bearer ${configAuth.authentication.token}`

        try{
            let request = await api("POST", baseUrl, "/digital-accounts", data, config)
            return request
        } catch(err){
            return err
        }
    },
    createCharge: async (data) => {
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
        config['Authorization'] = `Bearer ${configAuth.authentication.token}`

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
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
        config['Authorization'] = `Bearer ${configAuth.authentication.token}`

        try{
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
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
        config['Authorization'] = `Bearer ${configAuth.authentication.token}`
       
        try{
            const paymentDataToApi = financialHelper.formatPayment(data.card, data.user, data.body.chargeId)
            
            let request = await api("POST", baseUrl, "/payments", paymentDataToApi, config)

            const paymentDataToDB = financialHelper.formatPaymentToDB(request.data, data.user)

            return paymentDataToDB
        } catch(err){
            console.log(err)
            return err
        }
    },
    cardTokenization: async (data) => {    
        const config = {}
        config['X-Api-Version'] = process.env.API_VERSION
        config['X-Resource-Token'] = process.env.PRIVATE_TOKEN
        config['Authorization'] = `Bearer ${configAuth.authentication.token}`

        try{
            let request = await api("POST", baseUrl, "/credit-cards/tokenization", data, config)
            return request.data
        } catch(err){
            return err
        }
    }
} 

module.exports = junoGateway
