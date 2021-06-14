const generateToken = require('../core/generateToken')

//Models
const Partner = require('../models/partner.model')

//Helpers
const partnerHelper = require('../helpers/partner.helper')

//Logs
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const partnerController = {
    create: async (req, res, next) => {
        const transaction = Sentry.startTransaction({
            op: "Create Partner",
            name: "Criação de Parceiro",
        });

        try{
            let fieldsMalformatted = partnerHelper.verifyFieldsBody(req.body)
            if(fieldsMalformatted.length > 0){
                req.body.fieldsMalformatted = fieldsMalformatted
                throw new Error('ERR001')
            }

            const { email } = req.body
            const partnerData = req.body

            if(await Partner.findOne({email})){
               throw new Error('ERR002')
            }

            const partner = await Partner.create(partnerData)
            
            if(!partner) throw new Error('ERR003')
            
            Sentry.setContext("Partner Created", {
                title: "Partner Created",
                stage: "1",
                payload: partner,
            });

            const token = await generateToken({id: partner.id, userOrPartner: "PARTNER"})

            res.status(201).json({userId: partner._id, token, error: false, type: "PARTNER"})
        } catch(e){
            Sentry.captureException(e);
            next(e)
        }finally{
            transaction.finish();
        }
    },
    update: async (req, res, next) =>{
        try{
            req.body.signUpCompleted = true
            req.body.updatedAt = Date.now()
            await Partner.updateOne({_id: req.userId}, req.body, function(err){
                if(err) throw new Error("ERR004")
            })
            res.status(200).json({message: "Dados alterados!", error: false})
        }catch(e){
            next(e)
        }
    },
    list: async (req, res, next) => {
        try{
            const partner  = await Partner.findOne({_id: req.userId})

            if(!partner) throw new Error("ERR005")

            res.status(200).json({partner, error: false})
        }catch(e){
            next(e)
        }
    }
}

module.exports = partnerController