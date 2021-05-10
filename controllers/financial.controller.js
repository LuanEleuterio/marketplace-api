//Models
const Cards = require('../models/cards.model')
const User = require('../models/user.model')
const Partner = require('../models/partner.model')
const Product = require('../models/products.model')
const Charge = require('../models/charge.model')
const Payment = require('../models/payment.model')

//Helpers
const orderHelper = require('../helpers/order.helper')

//interface
const interface = require('../core/services/gateway/interface')

const financialController = {
    getBanks: async (req, res, next) => {
        try{
            let response = await interface.getBanks()
            return res.send(response)
        } catch(err){
            return res.send(err)
        }
    },
    getBusiness: async (req, res, next) => {
        try{
            let response = await interface.getBusiness()
            return res.send(response)
        } catch(err){
            return res.send(err)
        }
    },
    getDocuments: async (req, res, next) => {
        try{
            let response = await interface.getDocuments()
            return res.send(response)
        } catch(err){
            return res.send(err)
        }
    },
    getBalance: async (req, res, next) => {
        const response = await interface.getBalance()
        res.send(response)
    },
    createCharge: async (req, res, next) => {
        const data = {}
        const orderId = await orderHelper.createOrder()

        try{
            const product = await Product.findOne({_id: req.body.productId})
            const partner = await Partner.findOne({_id: product.partnerId})
            const user = await User.findOne({_id: req.userId})
       
            data.body = req.body
            data.product = product
            data.partner = partner
            data.user = user

            const response = await interface.createCharge(data)

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
                req.body.chargeId = charge.id
                req.orderId = orderId
                financialController.sendPayment(req)
            }

            return res.send(charge)
        } catch(err){
            return res.send(err)
        }
    },
    cancelCharge: async (req, res, next) =>{
        const data = {}
        try{
            const response = await interface.cancelCharge(req.body.chargeId)
            
            if(response.status >= 400){
                return res.send({response: response})
            }

            await Charge.updateOne({id:req.body.chargeId},{status: "CANCELED"}, function(err, res) {
                if (err) res.send(err)
            })

            data.orderId = req?.body.orderId ? req.body.orderId : req.orderId
            data.status = "CANCELED"
            await orderHelper.updateOrder(data)

            return res.send({message: "Charge canceled!"})
        }catch(err){
            return res.send(err)
        }
    },
    sendPayment: async (req, res, next) => {
        const data = {}
      
        try{
            const card = await Cards.findOne({_id: req.body.cardId})
            const user = await User.findOne({_id: req.userId})

            data.body = req.body
            data.card = card
            data.user = user

            const response = await interface.sendPayment(data)
            const payment = await Payment.create(response)

            await Charge.updateOne({id:data.body.chargeId},{status: "PAID"}, function(err, res) {
                if (err) res.send(err)
            })

            data.orderId = req?.body.orderId ? req.body.orderId : req.orderId
            data.payment = payment._id
            data.status = "PAYMENT ACCEPTED"
            await orderHelper.updateOrder(data)

            // Retorno sem res.send pois a sendPayment foi chamada pela createCharge
            if(req.orderId) return
            
            return res.send(payment)   
        } catch(err){
            console.log(err)
            return err
        }
    },
    cardTokenization: async (req, res, next) => {    
        const userId = req.userId
        
        try{
            const response = await interface.cardTokenization(req.body)

            response.idCustomer = userId
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
