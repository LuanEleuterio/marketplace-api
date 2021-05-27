//Models
const Cards = require('../models/cards.model')
const Charge = require('../models/charge.model')
const Payment = require('../models/payment.model')

const financialHelper = {
    formatToSendApi: async (user, partner, product, body) => {    
        let productPrice = (product.price * body.productQtd) + body.shippingValue
        const data = {
            charge:{
                description: product.name,
                amount: productPrice.toFixed(2),
                discountAmount: "0.00",
                paymentTypes: [
                    body.paymentType
                ],
                paymentAdvance: true,
                split: [
                    {
                    recipientToken: process.env.PRIVATE_TOKEN,
                    percentage: 20,
                    amountRemainder: true,
                    chargeFee: true
                    },
                    {
                    recipientToken: partner.junoAccount.resourceToken,
                    percentage: 80,
                    amountRemainder: false,
                    chargeFee: true
                    }
                ]
            },
            billing: {
                name: user.name,
                document: user.document,
                email: user.email,
                address: user.address
            }
        }
        return data
    },

    formatToSendDB: async (user, product, paymentType, body) => {    
        const data = {
            id: body.id,
            code: body.code,
            dueDate: body.dueDate,
            paymentType: paymentType,
            amount: body.amount,
            discountAmount: "0.00",
            url: body?.link ? body?.link : body?.checkoutUrl,
            status: body.status,
            customer: {_id: user.id},
            product:{_id: product.id}
        }
        return data
    },

    formatPayment: async (card, user, charge) => {    
        const data = {
            chargeId: charge,
            billing:{
                email: user.email,
                address: user.address,
                delayed: false
            },
            creditCardDetails:{
                creditCardId: card.creditCardId
            }
        }
        return data
    },

    formatPaymentToDB: async (payment, user) => {    
        let paymentArr = []
        for( let pay of payment.payments){
            paymentArr.push(
                {
                    id: pay.id,
                    charge: pay.chargeId,
                    date: pay.date,
                    amount: pay.amount,
                    fee: pay.fee,
                    type: pay.type,
                    status: pay.status  
                }
            )
        }
    
        const data = {
            transactionId: payment.transactionId,
            installments: payment.installments,
            payment: paymentArr,
            customer:{_id: user.id},
        }
    
        return data
    },
    
    sendPay: async (pay, gateway) => {
        let obj = {}
        try{
            const card = await Cards.findOne({_id: pay.cardId})

            obj.body = pay.body
            obj.card = card
            obj.user = pay.user

            const response = await gateway.sendPayment(obj)
            const payment = await Payment.create(response)

            await Charge.updateOne({id:obj.body.chargeId},{status: "PAID"}, function(err, res) {
                if (err) res.send(err)
            })

            return payment._id  
        } catch(err){
            console.log(err)
            return err.stack
        }
    }
}

module.exports = financialHelper