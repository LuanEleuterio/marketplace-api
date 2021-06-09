//Models
const Product = require('../models/products.model')
const Orders = require('../models/order.model')

//Services
const shipping = require('../core/services/shipping/interface')

const Sentry = require("@sentry/node");

const Tracing = require("@sentry/tracing");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const productController = {
    create: async (req, res, next) => {
        try{   
            req.body.partner = req.userId
            const product = await Product.create(req.body)
            return res.status(201).json({message: "Product created!", product, error: false})
        } catch(err){
            return res.status(400).json({err: err.stack, message: 'Problema ao tentar criar produto', error: true})
        }
    },

    update: async (req, res, next) => {
        const data = req.body
        try{
            data.updatedAt = Date.now()
            await Product.updateOne({_id: data.productId}, data)
            return res.status(200).json({message:"Produto alterado", error: false})
        }catch(err){
            return res.status(400).json({error: err.stack, message:"Problema ao atualizar produto", error: true})
        }
    },

    delete: async (req, res, next) => {
        try{
            let hasProdInOrder = await Orders.findOne({'details.product': req.params.productId})

            if(!hasProdInOrder){
                await Product.deleteOne({ _id: req.params.productId });
            }else{
                await Product.updateOne({_id: req.params.productId}, {active: false, deleted: true, deletedAt: Date.now()})
            }

            return res.status(200).json({message:"Produto excluído", error: false})
        }catch(err){
            return res.status(400).json({err: err.stack, message: "Problema ao excluir o produto", error: true})
        }
    },

    list: async (req, res, next) => {
        try{
            const product  = await Product.findOne({_id: req.params.productId})
            .populate('partner', {_id: 1, name: 1})
            return res.status(200).json({product, error: false})
        }catch(err){
            return res.status(404).json({err: err.stack, message: "Produto não encontrado", error: true})
        }
    },

    listAll: async (req, res, next) => {
        const transaction = Sentry.startTransaction({
            op: "test",
            name: "My First Test Transaction",
          });
          
        try {
            Sentry.setContext("character", {
                name: "Luan",
                age: 22,
                attack_type: "fura",
              });
            const products  = await Product.find().populate('partner', {_id: 1, name: 1})
            return res.status(200).json({products, error: false})
        } catch (e) {
            Sentry.captureException(e);
            res.status(404).json({err: err.stack, message: "Produtos não encontrados", error: true})
        } finally {
            transaction.finish();
        }
    },

    listIn: async (req, res, next) => {
        let productsId = []
        try{
            for( let product of req.body.products){
                productsId.push(product.productId)
            }
            
            const products  = await Product.find({_id: {$in: productsId }})
            .populate('partner', {_id: 1, name: 1})

            return res.status(200).json({products, error: false})
        }catch(err){
            return res.status(404).json({err: err.stack, message: "Produtos não encontrados", error: true})
        }
    },

    listByPartner: async (req, res, next) => {
        try{
            const products  = await Product.find({partner: req.userId}).populate('partner', {_id: 1, name: 1})
            return res.status(200).json({products, error: false})
        }catch(err){
            return res.status(404).json({err: err.stack, message: "Produtos não encontrados", error: true})
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
            
            return res.status(200).json({shippingValue, error: false})
        }catch(err){
            return res.status(400).json({err: err.stack, message: "Problema ao calcular frete", error: true})
        }
    },
}

module.exports = productController