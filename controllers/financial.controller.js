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

            await Partner.updateOne({_id: req.userId}, data, function(err, res) {
                if (err) res.json(err)
            })
            return res.status(201).json({message: "Conta Digital criada!"})
        }catch(err){
            res.json(err.stack)
        }
    },
    getBanks: async (req, res, next) => {
        try{
            let response = await gateway.getBanks()
            return res.send(response)
        } catch(err){
            return res.send(err)
        }
    },
    getBusiness: async (req, res, next) => {
        try{
            let response = await gateway.getBusiness()
            return res.send(response)
        } catch(err){
            return res.send(err)
        }
    },
    getDocuments: async (req, res, next) => {
        try{
            const partner = await Partner.findOne({_id: req.userId})

            let resourceToken = partner.junoAccount.resourceToken

            let response = await gateway.getDocuments(resourceToken)
            return res.json(response)
        } catch(err){
            return res.json(err)
        }
    },
    sendDocuments: async (req, res, next) => {
        try{
            let response = await gateway.sendDocuments(req.body.documentId)
            return res.send(response)
        } catch(err){
            return res.send(err)
        }
    },
    getBalance: async (req, res, next) => {
        try{
            const partner = await Partner.findOne({_id: req.userId})

            let resourceToken = partner.junoAccount.resourceToken

            const response = await gateway.getBalance(resourceToken)
            res.json(response)
        } catch(err){
            return res.json(err)
        }
    },
    createOrder: async (req, res, next) => {
        const data = {}
        const orderId = await orderHelper.createOrder()

        try{
            const product = await Product.findOne({_id: req.body.productId})
            const partner = await Partner.findOne({_id: product.partner})
            const user = await User.findOne({_id: req.userId})
       
            data.body = req.body
            data.product = product
            data.partner = partner
            data.user = user

            const response = await gateway.createCharge(data)

            const charge = await Charge.create(response)
            
            data.user = user._id
            data.charge = charge._id
            data.partner = partner._id
            data.product = product._id
            data.amount = req.body.qtd
            data.orderId = orderId
            data.status = "PROCESSING"
            await orderHelper.updateOrder(data)

            if(req.body.paymentType === "CREDIT_CARD"){
                req.body.user = user
                req.body.chargeId = charge.id
                req.orderId = orderId
                financialController.sendPayment(req)
            }

            return res.send(charge)
        } catch(err){
            return res.send(err)
        }
    },
    cancelOrder: async (req, res, next) =>{
        const data = {}
        try{
            const order = await Order.findOne({_id: req.params.orderId}).populate('charge')
            const response = await gateway.cancelCharge(order.charge.id)
            
            if(response.status >= 400){
                return res.send({response: response})
            }

            await Charge.updateOne({id:req.body.chargeId},{status: "CANCELED"}, function(err, res) {
                if (err) res.send(err)
            })

            data.orderId = req?.params.orderId ? req.params.orderId : req.orderId
            data.status = "CANCELED"
            await orderHelper.updateOrder(data)

            return res.send({message: "Order canceled!"})
        }catch(err){
            return res.send(err)
        }
    },
    sendPayment: async (req, res, next) => {
        const data = {}
        let user 

        try{
            const card = await Cards.findOne({_id: req.body.cardId})

            if(req?.orderId){
                user = req.body.user
            }else{
                user = await User.findOne({_id: req.userId})
            }

            data.body = req.body
            data.card = card
            data.user = user

            const response = await gateway.sendPayment(data)
            const payment = await Payment.create(response)

            await Charge.updateOne({id:data.body.chargeId},{status: "PAID"}, function(err, res) {
                if (err) res.send(err)
            })

            data.orderId = req?.body.orderId ? req.body.orderId : req.orderId
            data.payment = payment._id
            data.status = "PAYMENT ACCEPTED"
            await orderHelper.updateOrder(data)

            // Retorno sem res.send pois a sendPayment foi chamada pela createCharge
            if(req?.orderId) return
            
            return res.send(payment)   
        } catch(err){
            console.log(err)
            return err
        }
    },
    cardTokenization: async (req, res, next) => {    
        const userId = req.userId
        const holderName = req.body.holderName
        try{
            delete req.body.holderName
            
            const response = await gateway.cardTokenization(req.body)

            response.customer = userId
            response.holderName = holderName
            const card = await Cards.create(response)

            await User.updateOne({_id:userId},{$addToSet: {cards: card.id}}, function(err, res) {
               if (err) console.log(err)
            })
            return res.send(response)
        } catch(err){
            return res.send(err)
        }
    }
} 

module.exports = financialController
