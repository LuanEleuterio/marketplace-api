const vendor = process.env.EMAIL_SERVICE
const emailProvider = require(`./vendor/${vendor}.vendor`)

const interface = {
    send: async (template_id, data) =>{
        return emailProvider.send(template_id, data)
    }    
}

module.exports = interface
