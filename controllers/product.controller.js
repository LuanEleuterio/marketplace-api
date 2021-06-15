//Models
const Product = require('../models/products.model')
const Orders = require('../models/order.model')

//Services
const shipping = require('../core/services/shipping/interface')

//Helpers
const productHelper = require('../helpers/product.helper')

const Sentry = require("@sentry/node");

const Tracing = require("@sentry/tracing");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const productController = {
    create: async (req, res, next) => {
        const transaction = Sentry.startTransaction({
            op: "Create Products",
            name: "Criação de Produtos"
        });

        try{   
            let fieldsMalformatted = productHelper.verifyFieldsBody(req.body)
            if(fieldsMalformatted.length > 0){
                req.body.fieldsMalformatted = fieldsMalformatted
                throw new Error('ERR001')
            }

            req.body.partner = req.userId
            const product = await Product.create(req.body)

            if(!product) throw new Error('ERR006')

            Sentry.setContext("Create Product", {
                title: "Create Product",
                stage: "1",
                partnerId: req.userId,
                payload: {
                    product
                },
            });

            return res.status(201).json({message: "Product created!", product, error: false})
        } catch(e){
            Sentry.captureException(e);
            next(e)
        }finally{
            transaction.finish();
        }
    },

    update: async (req, res, next) => {
        const data = req.body

        const transaction = Sentry.startTransaction({
            op: "Update Products",
            name: "Atualizar de Produtos"
        });

        try{
            data.updatedAt = Date.now()
            await Product.updateOne({_id: data.productId}, data, function(err){
                if(err) throw new Error("ERR007")
            })

            Sentry.setContext("Update Product", {
                title: "Update Product",
                stage: "1",
                partnerId: req.userId,
                payload: {
                    productId: data.productId
                },
            });

            return res.status(200).json({message:"Produto alterado", error: false})
        }catch(e){
            Sentry.captureException(e);
            next(e)
        }finally{
            transaction.finish();
        }
    },

    delete: async (req, res, next) => {
        const transaction = Sentry.startTransaction({
            op: "Delete Products",
            name: "Exclusão de Produtos"
        });

        try{
            let hasProdInOrder = await Orders.findOne({'details.product': req.params.productId})

            if(!hasProdInOrder){
                await Product.deleteOne({ _id: req.params.productId }, function(err){
                    if(err) throw new Error("ERR008")
                });
            }else{
                await Product.updateOne({_id: req.params.productId}, {active: false, deleted: true, deletedAt: Date.now()},
                    function(err){
                        if(err) throw new Error("ERR008")
                })
            }

            Sentry.setContext("Delete Product", {
                title: "Delete Product",
                stage: "1",
                partnerId: req.userId,
                payload: {
                    productId: req.params.productId
                },
            });
            return res.status(200).json({message:"Produto excluído", error: false})
        }catch(e){
            Sentry.captureException(e);
            next(e)
        }finally{
            transaction.finish();
        }
    },

    list: async (req, res, next) => {
        try{
            const product  = await Product.findOne({_id: req.params.productId})
            .populate('partner', {_id: 1, name: 1})

            if(!product) throw new Error('ERR009')

            res.status(200).json({product, error: false})
        }catch(e){
            next(e)
        }
    },

    listAll: async (req, res, next) => {
        try {
            const products  = await Product.find().populate('partner', {_id: 1, name: 1})

            if(!products) throw new Error('ERR009')

            res.status(200).json({products, error: false})
        } catch (e) {
          next(e)
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

            if(!products) throw new Error('ERR009')

            res.status(200).json({products, error: false})
        }catch(e){
           next(e)
        }
    },

    listByPartner: async (req, res, next) => {
        try{
            const products  = await Product.find({partner: req.userId}).populate('partner', {_id: 1, name: 1})
            
            if(!products) throw new Error('ERR009')

            res.status(200).json({products, error: false})
        }catch(e){
           next(e)
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