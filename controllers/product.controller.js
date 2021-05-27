//Models
const Product = require('../models/products.model')
const Orders = require('../models/order.model')

//Services
const shipping = require('../core/services/shipping/interface')

const productController = {
    create: async (req, res, next) => {
        req.body.partner = req.userId
        try{   
            const product = await Product.create(req.body)
            return res.status(200).json({message: "Product created!", product})
        } catch(err){
            return res.status(403).json(err)
        }
    },

    update: async (req, res, next) => {
        const data = req.body
        try{
            await Product.updateOne({_id: data.productId}, data, function(err, res) {
                if (err) res.json(err)
            })
            res.json({message:"Produto alterado"})
        }catch(err){
            res.json(err.stack)
        }
    },

    delete: async (req, res, next) => {
        try{

            let hasProdInOrder = await Orders.findOne({'details.product': req.params.productId})

            if(!hasProdInOrder){
                await Product.deleteOne({ _id: req.params.productId }, function (err, res) {
                    if (err) return res.send(err);
                });
    
            }else{
                await Product.updateOne({_id: req.params.productId}, {active: false}, function(err, res) {
                    if (err) res.json(err)
                })
            }

            return res.json({message:"Produto excluído"})
        }catch(err){
            return res.json(err.stack)
        }
    },

    list: async (req, res, next) => {
        const product  = await Product.findOne({_id: req.params.productId})
        .populate('partner', {_id: 1, name: 1})

        return res.json(product)
    },

    listAll: async (req, res, next) => {
        const products  = await Product.find().populate('partner', {_id: 1, name: 1})
        res.json(products)
    },

    listIn: async (req, res, next) => {
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

    listByPartner: async (req, res, next) => {
        try{
            const products  = await Product.find({partner: req.userId}).populate('partner', {_id: 1, name: 1})
            res.json(products)
        }catch(err){
            res.json(err.stack)
        }

    },

    shipping: async(req, res, next) => {
        let data = {}
        try{
            let productId = req.query.productId
            let productQtd = req.query?.productQtd ? req.query.productQtd : 1
            
            let product = await Product.findOne({_id: productId}).populate('partner', {_id: 1, address: 1})

            data.cepDestino = req.query.cepDestino
            data.partner = product.partner
            data.product = product
            data.productQtd = productQtd
            
            let shippingValue = await shipping.calculateShipping(data)
            
            res.json(shippingValue)
        }catch(err){
            res.json(err.stack)
        }
    },
}

module.exports = productController