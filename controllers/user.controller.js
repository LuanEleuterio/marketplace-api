const generateToken = require("../core/generateToken");

//Models
const User = require("../models/user.model");
const Cards = require("../models/cards.model");
const Charge = require("../models/charge.model");
const Orders = require("../models/order.model");
const Products = require("../models/products.model");

//Helpers
const userHelper = require('../helpers/user.helper')

//Services
const shipping = require('../core/services/shipping/interface')
const financialHelper = require('../helpers/financial.helper')

//interface
const gateway = require('../core/services/gateway/interface')

const userController = {
    create: async (req, res, next) => {
        const { email } = req.body;

        try {
            if (await User.findOne({ email })) {
                return res.status(400).send({ error: "User already exists" });
            }

            const user = await User.create(req.body);
            const token = await generateToken({ id: user.id, userOrPartner: "USER"});

            user.password = undefined;

            await userHelper.sendEmailWelcome(req.body)

            return res.json({ userId: user._id, token });
        } catch (err) {
            return res
                .status(400)
                .send({ error: err, message: "Registration failed" });
        }
    },
    update: async (req, res, next) => {
        try{
            req.body.signUpCompleted = true
            await User.updateOne({_id: req.userId}, req.body, function(err, res) {
                if (err) res.json(err)
            })
            return res.json({message:'Dados atualizados!'})
        }catch(err){
            return res.json(err.stack)
        }
    },
    list: async (req, res, next) => {
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
    }
};

module.exports = userController;
