const generateToken = require('../core/generateToken')

//Models
const Partner = require('../models/partner.model')
const Product = require('../models/products.model')
const Orders = require('../models/order.model')

//Services
const gateway = require('../core/services/gateway/interface')

const partnerController = {
    register: async (req, res, next) => {
        const { email } = req.body
        const partnerData = req.body
        const password = partnerData.password
        const errors = [400,401,402,403,404,500,501,502,503,504]


        delete partnerData.password

        try{
            if(await Partner.findOne({email})){
                return res.status(400).json({error: "Partner already exists"})
            }

           /* let request = await gateway.createAccount(partnerData)

            if(errors.indexOf(request.status) > -1){
                return res.status(request.status).json(request.data)
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
            */
            delete partnerData.type

            partnerData.password = password

            const partner = await Partner.create(partnerData)

            const token = await generateToken({id: partner.id, userOrPartner: "PARTNER"})

            partner.password = undefined

            return res.json({partnerId: partner._id, token})
        } catch(err){
            return res.status(403).json(err)
        }
    },
    updatePartner: async (req, res, next) =>{
        let data
        try{
            const partner = await Partner.findOne({_id: req.userId}, {_id: 0, createdAt: 0, junoAccount: 0, __v: 0})
            if(!partner) {
                return res.status(404).json({message:"Partner not found"})
            }

            data = {
                type: "PAYMENT",
                ...partner._doc,
                ...req.body,
            }

            let request = await gateway.createAccount(data)

            data.junoAccount = {
                idAccount: request.data.id,
                type: request.data.type,
                personType: request.data.personType,
                status: request.data.status,
                accountNumber: request.data.accountNumber,
                resourceToken: request.data.resourceToken,
                createdAt: request.data.createdOn
            }

            await Partner.updateOne({_id: req.userId}, data, function(err, res) {
                if (err) res.json(err)
            })
            return res.status(201).json({message: "Conta Digital criada!"})
        }catch(err){
            res.json(err.stack)
        }
    },
    createProduct: async (req, res, next) => {

        req.body.partner = req.userId
        req.body.status = true
        
        try{   
            const product = await Product.create(req.body)
            return res.status(200).json({message: "Product created!", product})
        } catch(err){
            return res.status(403).json(err)
        }
    },
    getProducts: async (req, res, next) => {
        const products  = await Product.find().populate('partner', {_id: 1, name: 1})
        res.send(products)
    },
    getProduct: async (req, res, next) => {
        const product  = await Product.findOne({_id: req.params.productId})
        .populate('partner', {_id: 1, name: 1})

        return res.json(product)
    },
    collectionProducts: async (req, res, next) => {
        let productsId = []
        for( let product of req.body.products){
            productsId.push(product.productId)
        }
        
        try{
            const product  = await Product.find({_id: {$in: productsId }})
            .populate('partner', {_id: 1, name: 1})

            return res.json(product)
        }catch(err){
           return res.json(err.stack)
        }
    },
    getPartner: async (req, res, next) => {
        const partner  = await Partner.findOne({_id: req.userId})
        res.json(partner)
    },
    getOrders: async (req, res, next) => {
        const orders = await Orders.find({ partner: req.userId },function (err, res) {
                if (err) res.status(400).send({error: err,message: "Orders not found!"});
            }
        ).populate("product")
        .populate("payment")
        .populate("charge")
        .populate("customer", {name: 1, address: 1, phone: 1, email: 1});

        return res.send(orders)
    },
}

module.exports = partnerController