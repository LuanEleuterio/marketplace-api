const api = require("../../../api")

const sendGridService = {
    send: async (template_id, data) => {
        try{

            const config = {
                'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
            }

            data = {
                ...data,
                from: {
                    name: process.env.NAME_COMPANY,
                    email: process.env.SENDGRID_SENDER_IDENTITY
                },
                template_id
            }

            let request = await api("POST", process.env.SENDGRID_URL, "/mail/send", data, config)

            return request.data
        } catch(err){
            return err
        }
    }
} 

module.exports = sendGridService
