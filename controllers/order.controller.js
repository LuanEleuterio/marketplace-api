//Models
const User = require("../models/user.model");
const Charge = require("../models/charge.model");
const Orders = require("../models/order.model");
const Product = require("../models/products.model");
const Partner = require("../models/partner.model");

//interface
const gateway = require('../core/services/gateway/interface')

//Helpers
const orderHelper = require("../helpers/order.helper")
const financialHelper = require('../helpers/financial.helper')

const orderController = {
    create: async (req, res, next) => {
        const data = {}
        const payment = {
            body:{}
        }
        const orderId = await orderHelper.createOrder()

        try{
            const user = await User.findOne({_id: req.userId})

            for(let order of req.body.orders){
                const product = await Product.findOne({_id: order.productId})
                const partner = await Partner.findOne({_id: product.partner})


                data.body = req.body
                data.body.productQtd = order.qtd
                data.body.shippingValue = order.shippingValue
                data.body.discountAmount = req.body.discountAmount
                data.product = product
                data.partner = partner
                data.user = user
                
                const response = await gateway.createCharge(data)
                if(req.body.paymentType){
                    response.card = req.body.cardId
                }

                const charge = await Charge.create(response)

                data.user = user._id
                data.charge = charge._id
                data.partner = partner._id
                data.product = product._id
                data.amount = order.qtd
                data.shippingValue = order.shippingValue
                data.orderId = orderId
                data.status = "PROCESSING"

                if(req.body.paymentType === 'CREDIT_CARD'){
                    payment.user = user
                    payment.body.chargeId = charge.id
                    payment.orderId = orderId
                    payment.cardId = req.body.cardId
                    data.paymentId = await financialHelper.sendPay(payment, gateway)
                }

                await orderHelper.updateOrder(data)
            }
            return res.json({message: "Pedido realizado!"})
        } catch(err){
            return res.send(err)
        }
    },
    cancel: async (req, res, next) => {

    },
    listByUser: async (req, res, next) => {
        try{
            const orders = await Orders.find({ customer: req.userId },function (err, res) {
                    if (err) res.status(400).send({error: err,message: "Orders not found!"});
                }
            ).populate('details.product')
            .populate("details.payment")
            .populate("details.charge")
            .populate("details.partner", {name: 1})
            .populate("customer", {address: 1});

            return res.json(orders)
        }catch(err){
            return res.json(err.stack)
        }   
    },
    listByPartner: async (req, res, next) => {
        try{

            const orders = await Orders.find({ 'details.partner': req.userId },function (err, res) {
                if (err) res.status(400).send({error: err,message: "Orders not found!"});
            }).populate("details.product")
            .populate("details.payment")
            .populate("details.charge")
            .populate("customer", {name: 1, address: 1, phone: 1, email: 1});
    
            return res.json(orders)
        }catch(err){
            return res.json(err.stack)
        }   
    }
};

module.exports = orderController;
