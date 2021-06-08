const generateToken = require("../core/generateToken");

//Models
const User = require("../models/user.model");

//Helpers
const userHelper = require('../helpers/user.helper')

const userController = {
    create: async (req, res, next) => {
        try {
            const { email } = req.body;
            
            if (await User.findOne({ email })) {
                return res.status(400).json({ error: "Usuário já existe" });
            }

            const user = await User.create(req.body);

            const token = await generateToken({ id: user.id, userOrPartner: "USER"});

            user.password = undefined;

            await userHelper.sendEmailWelcome(req.body)

            return res.status(201).json({ userId: user._id, token, error: false, type: "USER"});
        } catch (err) {
            return res.status(400).json({ err: err, message: "Problema ao cadastrar", error: true });
        }
    },
    update: async (req, res, next) => {
        try{
            req.body.signUpCompleted = true
            req.body.updatedAt = Date.now()
            await User.updateOne({_id: req.userId}, req.body)
            return res.status(200).json({message:'Dados atualizados!', error: false})
        }catch(err){
            return res.status(400).json({err: err.stack, message: "Problemas ao atualizar dados", error: true})
        }
    },
    list: async (req, res, next) => {
        try {
            const user = await User.findOne({ _id: req.userId })
            .populate('cards', {_id: 1, last4CardNumber: 1});
            user.password = undefined;

            return res.status(200).json({ user, error: false });
        } catch (err) {
            return res.status(404).json({ err: err, message: "Usuário não encontrado", error: true});
        }
    }
};

module.exports = userController;
