const api = require("../core/api")
const generateToken = require('../core/generateToken')
const configAuth = require('../config/auth.json')

const Partner = require('../models/partner.model')
const Product = require('../models/products.model')

const interface = require('../core/services/gateway/interface')

const partnerController = {
    register: async (req, res, next) => {
        const { email } = req.body
        const partnerData = req.body
        const password = partnerData.password
        const errors = [400,401,402,403,404,500,501,502,503,504]

        partnerData.type = 'PAYMENT'
        delete partnerData.password

        try{
            if(await Partner.findOne({email})){
                return res.status(400).send({error: "Partner already exists"})
            }

            let request = await interface.createAccount(partnerData)

            if(errors.indexOf(request.status) > -1){
                return res.status(request.status).send(request.data)
            }

            partnerData.junoAccount = {
                idAccount: request.data.id,
                type: request.data.type,
                personType: request.data.personType,
                status: request.data.status,
                accountNumber: request.data.accountNumber,
                resourceToken: request.data.resourceToken,
                createdAt: request.data.createdOn
            }

            delete partnerData.type

            partnerData.password = password

            const partner = await Partner.create(partnerData)

            const token = await generateToken({id: partner.id})

            partner.password = undefined

            return res.send({partner, token})
        } catch(err){
            return res.status(403).send(err)
        }
    },
    createProduct: async (req, res, next) => {

        req.body.partner = req.userId
        req.body.status = true
        
        try{   
            const product = await Product.create(req.body)
            return res.status(200).send({message: "Product created!", product})
        } catch(err){
            return res.status(403).send(err)
        }
    },
    getProducts: async (req, res, next) => {
        const products  = await Product.find().populate('partner', {_id: 1, name: 1})
        res.send(products)
    }
}

module.exports = partnerController