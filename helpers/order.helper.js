const moment = require('moment')

//Models
const Order = require('../models/order.model')

const orderHelper = {
    createOrder: async () => {
        const data = {}
        const dateNow = moment().tz("America/Sao_Paulo").format('YYYY-MM-DD')

        data.status = 'PROCESSING'
        data.date = dateNow
        const order = await Order.create(data)

        if(!order) throw new Error("ERR010")

        return order._id
    },
    updateOrder: async (data) =>{ 
        const order = {}
        const user = {}

        data?.user      ? user.customer  = data.user    : null
        data?.partner   ? order.partner  = data.partner : null
        data?.charge    ? order.charge   = data.charge  : null
        data?.product   ? order.product  = data.product : null
        data?.payment   ? order.payment  = data.payment : null
        data?.status    ? order.status   = data.status  : null
        data?.paymentId ? order.payment  = data.paymentId : null
        data?.amount    ? order.amount   = parseInt(data.amount)  : null
        data?.shippingValue ? order.shippingValue  = data.shippingValue : null
        order.updateAt = Date.now()

        await Order.updateOne({_id: data.orderId }, {$addToSet: {details: order}, customer: user.customer},
            function(err){
                if(err) throw new Error("ERR012")
        })
        return
    }
}

module.exports = orderHelper
