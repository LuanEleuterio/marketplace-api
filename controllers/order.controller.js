//Models
const User = require("../models/user.model");
const Charge = require("../models/charge.model");
const Orders = require("../models/order.model");
const Product = require("../models/products.model");
const Partner = require("../models/partner.model");
const Payment = require("../models/payment.model");

//interface
const gateway = require('../core/services/gateway/interface')

//Helpers
const orderHelper = require("../helpers/order.helper")
const financialHelper = require('../helpers/financial.helper')

//Logs
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const orderController = {
    create: async (req, res, next) => {
        const transaction = Sentry.startTransaction({
            op: "Create Order",
            name: "Criação de Pedido(s)",
        });

        try{
            const data = {}
            const payment = {
                body:{}
            }

            const orderId = await orderHelper.createOrder()
            const user = await User.findOne({_id: req.userId})

            Sentry.setContext("Order Created", {
                title: "Order Created",
                stage: "1",
                orderId: orderId,
                payload: req.body,
            });

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

                Sentry.setExtra("Charge Created", {
                    title: "Charge Created",
                    stage: "2",
                    orderId: orderId,
                    payload: charge,
                })

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
                    data.paymentId = await financialHelper.sendPay(payment, gateway.sendPayment)
                   
                    Sentry.setExtra("Payment Created", {
                        title: "Payment Created",
                        stage: "2",
                        orderId: orderId,
                        payload: {
                            paymentId: data.paymentId
                        },
                    })
                }

                let newQtd = product.qtd - order.qtd

                await orderHelper.updateOrder(data)
                await Product.updateOne({_id: product._id}, {qtd: newQtd})

                Sentry.setExtra("Order Update", {
                    title: "Order Update",
                    stage: "2",
                    orderId: orderId,
                    payload: {
                        productId: product._id,
                        productName: product.name
                    },
                })
            }
            return res.status(201).json({message: "Pedido realizado!", orderId, error: false})
        } catch(err){
            Sentry.captureException(err);
            await Order.deleteOne({_id: orderId})
            res.status(400).json({err: err.stack, message: "Não foi possível realizar o pedido!", error: true })
        }finally{
            transaction.finish();
        }
    },
    cancel: async (req, res, next) => {
        const transaction = Sentry.startTransaction({
            op: "Cancel Order",
            name: "Cancelamento de Pedido(s)",
        });

        try{            
            const order = await Orders.findOne({_id: req.body.orderId})
                .select({ details: {$elemMatch: {_id: req.body.itemId}}})
                .populate('details.product')
                .populate('details.payment')
                .populate('details.charge')
                .populate('details.partner')
            
            const data = {
                split: [
                    {
                    recipientToken: process.env.PRIVATE_TOKEN,
                    percentage: 20,
                    amountRemainder: true,
                    chargeFee: true
                    },
                    {
                    recipientToken: order.details[0].partner.junoAccount.resourceToken,
                    percentage: 80,
                    amountRemainder: false,
                    chargeFee: true
                    }
                ]
            }

            const paymentCanceled = await gateway.cancelPayment(order.details[0].payment.payment[0].id, data)
            
            await Payment.updateOne({_id: order.details[0].payment._id}, {$addToSet: {cancelDetails: paymentCanceled}});

            await Charge.updateOne({_id: order.details[0].charge._id}, {status: 'CUSTOMER_PAID_BACK'})

            await Orders.updateOne({_id: req.body.orderId, details: {$elemMatch: {_id: req.body.itemId}}},
                {$set: {'details.$.status': "CANCELED",}});
            
            console.log(order.details[0]._id)
            console.log(order.details[0]._id.toString())

            Sentry.setContext("Item Order Canceled", {
                title: "Item Order Canceled",
                stage: "1",
                orderId: order._id,
                payload: {
                    itemId: order.details[0]._id.toString(),
                    productName: order.details[0].product.name
                },
            });

            res.status(200).json({message:"Item cancelado!", error: false})
        }catch(err){
            Sentry.captureException(err);
            res.status(400).json({err: err.stack, message: "Problema ao cancelar o pedido!", error: true })
        }finally{
            transaction.finish();
        }
    },
    listByUser: async (req, res, next) => {
        try{
            const orders = await Orders.find({customer: req.userId })
            .sort({createdAt: -1})
            .populate('details.product')
            .populate("details.payment")
            .populate("details.charge")
            .populate("details.partner", {name: 1})
            .populate("customer", {address: 1});
            
            return res.status(200).json({orders, error: false})
        }catch(err){
            return res.status(404).json({err: err.stack, message:"Pedidos não encontrados", error: true})
        }   
    },
    listByPartner: async (req, res, next) => {
        try{
            const orders = await Orders.find({'details.partner': req.userId })
            .select({'details.partner': {$elemMatch: {partner: req.userId}}})
            .sort({createdAt: -1})
            .populate("details.product")
            .populate("details.payment")
            .populate("details.charge")
            .populate("customer", {name: 1, address: 1, phone: 1, email: 1});

            for( let order of orders){
                let newOrder = order.details.filter((detail) => {
                    return req.userId == detail.partner
                })
                order.details = newOrder
            }
            return res.status(200).json({orders, error: false})
        }catch(err){
            return res.status(404).json({err: err.stack, message:"Pedidos não encontrados", error: true})
        }   
    }
};

module.exports = orderController;
