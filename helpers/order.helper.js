//Models
const Order = require('../models/order.model')

const orderHelper = {
    createOrder: async () => {
        const data = {}
        data.status = 'PROCESSING'

        const order = await Order.create(data)
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
        try{
            await Order.updateOne({_id: data.orderId }, {$addToSet: {details: order}, customer: user.customer})
            return
        }catch(err){
            return err
        }
    }
}

module.exports = orderHelper
