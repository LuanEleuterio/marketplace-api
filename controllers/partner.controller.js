const generateToken = require('../core/generateToken')

//Models
const Partner = require('../models/partner.model')

const partnerController = {
    create: async (req, res, next) => {
        try{
            const { email } = req.body
            const partnerData = req.body

            if(await Partner.findOne({email})){
                return res.status(400).json({error: "Parceiro já existe"})
            }

            const partner = await Partner.create(partnerData)

            const token = await generateToken({id: partner.id, userOrPartner: "PARTNER"})

            partner.password = undefined

            return res.status(201).json({partnerId: partner._id, token, error: false})
        } catch(err){
            return res.status(400).json({err: err.stack, message: "Problema ao criar parceiro", error: true})
        }
    },
    update: async (req, res, next) =>{
        try{
            req.body.signUpCompleted = true
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