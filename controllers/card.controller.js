//Models
const User = require("../models/user.model");
const Cards = require("../models/cards.model");
const Charge = require("../models/charge.model");

//interface
const gateway = require('../core/services/gateway/interface')

//Logs
const Sentry = require("@sentry/node");
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const userController = {
    create: async (req, res, next) => {
        const transaction = Sentry.startTransaction({
            op: "Create Cards",
            name: "Criação de Cartões"
        });

        try{
            const userId = req.userId
            const holderName = req.body.holderName

            delete req.body.holderName
            
            const response = await gateway.cardTokenization(req.body)

            response.customer = userId
            response.holderName = holderName
            const card = await Cards.create(response)

            if(!card) throw new Error('ERR023')

            await User.updateOne({_id:userId},{$addToSet: {cards: card.id}}, function(err, res) {
               if (err) throw new Error('ERR004')
            })
                     
            Sentry.setContext("Create Cards", {
                title: "Create Cards",
                stage: "1",
                userId: userId,
                payload: {
                    hash: req.body.creditCardHash
                },
            });

            return res.status(201).json({cards: response, error: false})
        } catch(e){
            Sentry.captureException(e);
            next(e)
        }finally{
            transaction.finish();
        }
    },
    delete: async (req, res, next) => {
        const transaction = Sentry.startTransaction({
            op: "Delete Cards",
            name: "Exclusão de Cartões"
        });
        try {
            const cardId = req.params.cardId;
            const userId = req.userId;

            await User.updateOne(
                { _id: userId },
                { $pull: { cards: cardId } },
                function (err, res) {
                    if (err) throw new Error('ERR004');
                }
            );
            
            let hasCardInCharge = await Charge.findOne({card: cardId})
            
            if(!hasCardInCharge){
                await Cards.deleteOne({ _id: cardId}, function(err){
                    if(err) throw new Error('ERR024')
                });
            }else{
                await Cards.updateOne({ _id: cardId }, {active: false, deleted: true, deletedAt: Date.now()},
                function(err){
                    if(err) throw new Error('ERR024')
                });
            }

            Sentry.setContext("Delete Cards", {
                title: "Delete Cards",
                stage: "1",
                userId: userId,
                payload: {
                    card: req.params.cardId
                },
            });

            return res.status(200).json({ message: "Cartão removido!" , error: false});
        } catch (e) {
            Sentry.captureException(e);
            next(e)
        }finally{
            transaction.finish();
        }
    },
    listAll: async (req, res, next) => {
        try{
            const cards = await Cards.find({ customer: req.userId })
            .populate("customer", {_id: 1, name: 1, address: 1})

            if(!cards) throw new Error("ERR025")

            return res.status(200).json({cards, error: false})
        }catch(e){
            next(e)
        }
    }
};

module.exports = userController;
