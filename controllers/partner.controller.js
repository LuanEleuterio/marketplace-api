const generateToken = require('../core/generateToken')

//Models
const Partner = require('../models/partner.model')

const partnerController = {
    create: async (req, res, next) => {
        const { email } = req.body
        const partnerData = req.body

        try{
            if(await Partner.findOne({email})){
                return res.status(400).json({error: "Partner already exists"})
            }

            const partner = await Partner.create(partnerData)

            const token = await generateToken({id: partner.id, userOrPartner: "PARTNER"})

            partner.password = undefined

            return res.json({partnerId: partner._id, token})
        } catch(err){
            return res.status(403).json(err)
        }
    },
    update: async (req, res, next) =>{
        try{
            req.body.signUpCompleted = true
            await Partner.updateOne({_id: req.userId}, req.body, function(err, res) {
                if (err) res.json(err)
            })
            return res.status(201).json({message: "Dados alterados!"})
        }catch(err){
            res.json(err.stack)
        }
    },
    list: async (req, res, next) => {
        const partner  = await Partner.findOne({_id: req.userId})
        res.json(partner)
    }
}

module.exports = partnerController