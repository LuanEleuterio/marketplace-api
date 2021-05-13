const generateToken = require("../core/generateToken");

//Models
const User = require("../models/user.model");
const Cards = require("../models/cards.model");
const Orders = require("../models/order.model");

const userController = {
    register: async (req, res, next) => {
        const { email } = req.body;

        try {
            if (await User.findOne({ email })) {
                return res.status(400).send({ error: "User already exists" });
            }
            const user = await User.create(req.body);
            const token = await generateToken({ id: user.id });

            user.password = undefined;

            return res.send({ user, token });
        } catch (err) {
            return res
                .status(400)
                .send({ error: err, message: "Registration failed" });
        }
    },
    getUser: async (req, res, next) => {
        try {
            const user = await User.findOne(
                { _id: req.userId },
                function (err, res) {
                    if (err) {
                        res.status(400).send({
                            error: err,
                            message: "User not found!",
                        });
                    }
                }
            ).populate("cards");
            user.password = undefined;

            return res.send({ user });
        } catch (err) {
            return res
                .status(400)
                .send({ error: err, message: "User search failed" });
        }
    },
    cancelCard: async (req, res, next) => {
        const cardId = req.body.cardId;
        const userId = req.userId;

        try {
            await User.updateOne(
                { _id: userId },
                { $pull: { cards: cardId } },
                function (err, res) {
                    if (err) return res.send(err);
                }
            );

            await Cards.deleteOne({ _id: cardId }, function (err, res) {
                if (err) return res.send(err);
            });

            return res.send({ message: "Cartão removido!" });
        } catch (err) {
            return res.send({ err });
        }
    },
    getOrders: async (req, res, next) => {
        const orders = await Orders.find({ customer: req.userId },function (err, res) {
                if (err) res.status(400).send({error: err,message: "Orders not found!"});
            }
        ).populate("product")
        .populate("payment")
        .populate("charge")
        .populate("partner");

        return res.send(orders)
    },
    getCards: async (req, res, next) => {
        const cards = await Cards.find({ customer: req.userId },function (err, res) {
            if (err) res.status(400).send({error: err,message: "Cards not found!"});
        }).populate("customer", {_id: 1, name: 1, address: 1})

        return res.send(cards)
    }
};

module.exports = userController;
