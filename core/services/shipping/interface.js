const vendor = process.env.SHIPPING_NAME
const shipping = require(`./vendor/${vendor}.vendor`)

const interface = {
    calculateShipping: async (data) =>{
        return shipping.calculate(data)
    }
}

module.exports = interface