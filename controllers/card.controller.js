//Models
const User = require("../models/user.model");
const Cards = require("../models/cards.model");
const Charge = require("../models/charge.model");

//interface
const gateway = require('../core/services/gateway/interface')

const userController = {
    create: async (req, res, next) => {
        const userId = req.userId
        const holderName = req.body.holderName
        try{
            delete req.body.holderName
            
            const response = await gateway.cardTokenization(req.body)

            response.customer = userId
            response.holderName = holderName
            const card = await Cards.create(response)

            await User.updateOne({_id:userId},{$addToSet: {cards: card.id}}, function(err, res) {
               if (err) console.log(err)
            })
            return res.status(201).json({cards: response, error: false})
        } catch(err){
            return res.status(400).json({err: err.stack, message: "Erro ao cadastrar cartão", error: true})
        }
    },
    delete: async (req, res, next) => {
        const cardId = req.params.cardId;
        const userId = req.userId;
        try {
            await User.updateOne(
                { _id: userId },
                { $pull: { cards: cardId } },
                function (err, res) {
                    if (err) return res.send(err);
                }
            );
            
            let hasCardInCharge = await Charge.findOne({card: cardId})

            if(!hasCardInCharge){
                await Cards.deleteOne({ _id: cardId}, function (err, res) {
                    if (err) return res.send(err);
                });
    
            }else{
                await Cards.updateOne({ _id: cardId }, {active: false},function (err, res) {
                    if (err) return res.send(err);
                });
            }

            return res.json({ message: "Cartão removido!" , error: false});
        } catch (err) {
            return res.json({err: err.stack, message: "Problema ao excluir cartão", error: true});
        }
    },
    listAll: async (req, res, next) => {
        try{
            const cards = await Cards.find({ customer: req.userId })
            .populate("customer", {_id: 1, name: 1, address: 1})

            return res.status(200).json({cards, error: false})
        }catch(err){
            return res.status(400).json({err: err.stack, message: "Cartões não encontrados", error: true})
        }
    }
};

module.exports = userController;
