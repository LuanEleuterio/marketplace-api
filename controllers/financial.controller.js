//Models
const Partner = require('../models/partner.model')

//interface
const gateway = require('../core/services/gateway/interface')

//Logs
const Sentry = require("@sentry/node");
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const financialController = {
    createDigitalAccount: async (req, res, next) => {
        const transaction = Sentry.startTransaction({
            op: "Create Digital Account",
            name: "Criação de Conta Digital",
        });
        
        let data
        try{
            const partner = await Partner.findOne({_id: req.userId}, {_id: 0, createdAt: 0, junoAccount: 0, __v: 0})
            
            if(!partner) {
                throw new Error("ERR005")
            }

            data = {
                type: "PAYMENT",
                ...partner._doc,
                ...req.body,
            }
            
            delete data.signUpCompleted
            delete data.hasJunoAccount

            let request = await gateway.createAccount(data)

            data.junoAccount = {
                idAccount: request.data.id,
                type: request.data.type,
                personType: request.data.personType,
                status: request.data.status,
                accountNumber: request.data.accountNumber,
                resourceToken: request.data.resourceToken,
                createdAt: request.data.createdOn
            }

            data.hasJunoAccount = true

            await Partner.updateOne({_id: req.userId}, data, function(err) {
                if(err) throw new Error('ERR004')
            })
            
            Sentry.setContext("Create Digital Account", {
                title: "Create Digital Account",
                stage: "1",
                partnerId: partner._id.toString(),
                payload: data.junoAccount,
            });

            return res.status(201).json({message: "Conta Digital criada!", data: data, error: false})
        }catch(e){
            Sentry.captureException(e);
            next(e)
        }finally{
            transaction.finish();
        }
    },
    getBanks: async (req, res, next) => {
        try{
            let response = await gateway.getBanks()
            return res.status(200).json(response)
        } catch(e){
            next(e)
        }
    },
    getBusiness: async (req, res, next) => {
        try{
            let response = await gateway.getBusiness()
            return res.status(200).json(response)
        } catch(err){
            next(e)
        }
    },
    getDocuments: async (req, res, next) => {
        try{
            const partner = await Partner.findOne({_id: req.userId})

            let resourceToken = partner.junoAccount.resourceToken

            let response = await gateway.getDocuments(resourceToken)
            return res.status(200).json(response)
        } catch(err){
            next(e)
        }
    },
    getBalance: async (req, res, next) => {
        try{
            const partner = await Partner.findOne({_id: req.userId})

            let resourceToken = partner.junoAccount.resourceToken

            const response = await gateway.getBalance(resourceToken)
            return res.status(200).json(response)
        } catch(err){
            next(e)
        }
    }
} 

module.exports = financialController
