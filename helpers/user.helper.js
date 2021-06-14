//Service Send Email
const emailService = require('../core/services/email/interface')

const {stringify} = require('flatted')

const userHelper = {
    sendEmailWelcome: async (user) => {
        try{
            const data =  {
                personalizations: [{
                    to: [{
                        name: `${user.name}`,
                        email: `${user.email}`
                    }],
                    dynamic_template_data:{
                        name: `${user.name}`,
                        link: 'https://google.com',
                        subject: 'Seja bem-vindo(a) a LuanEletro'
                    },
                    subject: null
                }]
            }
            const email = await emailService.send("d-b89cb6485ac04721bf661afc0dcd2402", data)
            return JSON.parse(stringify(email))
        }catch(err){
            res.send(err.stack)
        }
    },

    verifyFieldsBody: async (body) =>{
        let fieldsNotFounds = []
        
        if(!body.name)
            fieldsNotFounds.push("name")
         
        if(!body.email)
            fieldsNotFounds.push("email")
             
        if(!body.dtnasc)
            fieldsNotFounds.push("dtnasc") 

        if(!body.password)
            fieldsNotFounds.push("password")
        
        return fieldsNotFounds
    }
}

module.exports = userHelper
