const generateToken = require('../core/generateToken')

//Models
const Partner = require('../models/partner.model')

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
            const { email } = req.body
            const partnerData = req.body

            if(await Partner.findOne({email})){
                return res.status(400).json({error: "Parceiro já existe"})
            }

            const partner = await Partner.create(partnerData)
            
            Sentry.setContext("Partner Created", {
                title: "Partner Created",
                stage: "1",
                payload: partner,
            });

            const token = await generateToken({id: partner.id, userOrPartner: "PARTNER"})

            return res.status(201).json({userId: partner._id, token, error: false, type: "PARTNER"})
        } catch(err){
            Sentry.captureException(err);
            return res.status(400).json({err: err.stack, message: "Problema ao criar parceiro", error: true})
        }finally{
            transaction.finish();
        }
    },
    update: async (req, res, next) =>{
        try{
            req.body.signUpCompleted = true
            req.body.updatedAt = Date.now()
            await Partner.updateOne({_id: req.userId}, req.body)

            return res.status(200).json({message: "Dados alterados!", error: false})
        }catch(err){
            return res.status(400).json({err: err.stack, message:"Problema ao atualizar produto", error: true})
        }
    },
    list: async (req, res, next) => {
        try{
            const partner  = await Partner.findOne({_id: req.userId})
            return res.status(200).json({partner, error: false})
        }catch(err){
            return  res.status(404).json({err: err.stack, message: "Problema ao procurar parceiro", error: true})
        }
    }
}

module.exports = partnerController