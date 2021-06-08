//Models
const Cards = require('../models/cards.model')
const User = require('../models/user.model')
const Partner = require('../models/partner.model')
const Product = require('../models/products.model')
const Charge = require('../models/charge.model')
const Payment = require('../models/payment.model')
const Order = require('../models/order.model')

//Helpers
const orderHelper = require('../helpers/order.helper')
const financialHelper = require('../helpers/financial.helper')

//interface
const gateway = require('../core/services/gateway/interface')

const financialController = {
    createDigitalAccount: async (req, res, next) => {
        let data
        try{
            const partner = await Partner.findOne({_id: req.userId}, {_id: 0, createdAt: 0, junoAccount: 0, __v: 0})
            
            if(!partner) {
                return res.status(404).json({message:"Partner not found"})
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

            await Partner.updateOne({_id: req.userId}, data)
            return res.status(201).json({message: "Conta Digital criada!", data: data, error: false})
        }catch(err){
            res.status(400).json({err: err.stack, error: true})
        }
    },
    getBanks: async (req, res, next) => {
        try{
            let response = await gateway.getBanks()
            return res.status(200).json(response)
        } catch(err){
            return res.status(400).json(err)
        }
    },
    getBusiness: async (req, res, next) => {
        try{
            let response = await gateway.getBusiness()
            return res.status(200).json(response)
        } catch(err){
            return res.status(500).json(err)
        }
    },
    getDocuments: async (req, res, next) => {
        try{
            const partner = await Partner.findOne({_id: req.userId})

            let resourceToken = partner.junoAccount.resourceToken

            let response = await gateway.getDocuments(resourceToken)
            return res.status(200).json(response)
        } catch(err){
            return res.status(400).json(err)
        }
    },
    getBalance: async (req, res, next) => {
        try{
            const partner = await Partner.findOne({_id: req.userId})

            let resourceToken = partner.junoAccount.resourceToken

            const response = await gateway.getBalance(resourceToken)
            return res.status(200).json(response)
        } catch(err){
            return res.status(400).json(err)
        }
    }
} 

module.exports = financialController
