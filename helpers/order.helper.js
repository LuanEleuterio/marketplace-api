//Models
const Order = require('../models/order.model')

const orderHelper = {
    createOrder: async () => {
        const data = {}
        data.status = 'PROCESSING'

        try{
            const order = await Order.create(data)
            return order._id
        }catch(err){
            console.log(err)
            return err
        }
    },
    updateOrder: async (data) =>{ 
        const order = {}

        data?.user      ? order.customer = data.user    : null
        data?.partner   ? order.partner  = data.partner : null
        data?.charge    ? order.charge   = data.charge  : null
        data?.product   ? order.product  = data.product : null
        data?.payment   ? order.payment  = data.payment : null
        data?.status    ? order.status   = data.status  : null
        data?.amount    ? order.amount   = parseInt(data.amount)  : null

        try{
            await Order.updateOne({_id: data.orderId }, order)
            return
        }catch(err){
            console.log(err)
            return err
        }
    }
}

module.exports = orderHelper
