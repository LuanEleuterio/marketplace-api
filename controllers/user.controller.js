const {generateToken} = require("../core/generateToken");

//Models
const User = require("../models/user.model");

//Helpers
const userHelper = require('../helpers/user.helper')

//Logs
const Sentry = require("@sentry/node");
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const userController = {
    create: async (req, res, next) => {
        const transaction = Sentry.startTransaction({
            op: "Create User",
            name: "Criação de Usuário",
        });
        try {
            let fieldsMalformatted = await userHelper.verifyFieldsBody(req.body)
            console.log("fieldsMalformatted",fieldsMalformatted)
            if(fieldsMalformatted.length > 0){
                req.body.fieldsMalformatted = fieldsMalformatted
                throw new Error('ERR001')
            }
            const { email } = req.body;
            
            if (await User.findOne({ email })) {
                throw new Error('ERR002')
            }

            const user = await User.create(req.body);
            console.log("user",user)
            if(!user) throw new Error("ERR003")

            Sentry.setContext("User Created", {
                title: "User Created",
                stage: "1",
                payload: user,
            });

            const token = await generateToken({ id: user._id, userOrPartner: "USER"});
            console.log("token",token)
            await userHelper.sendEmailWelcome(req.body)

            return res.status(201).json({ userId: user._id, token, error: false, type: "USER"});
        } catch (e) {
            Sentry.captureException(e);
            next(e)
        } finally{
            transaction.finish();
        }
    },
    update: async (req, res, next) => {
        try{
            req.body.signUpCompleted = true
            req.body.updatedAt = Date.now()
            await User.updateOne({_id: req.userId}, req.body, function(err){
                if(err) throw new Error("ERR004")
            })

            res.status(200).json({message:'Dados atualizados!', error: false})
        }catch(e){
            next(e)
        }
    },
    list: async (req, res, next) => {
        try {
            const user = await User.findOne({ _id: req.userId })
            .populate('cards', {_id: 1, last4CardNumber: 1});

            if(!user) throw new Error("ERR005")

            res.status(200).json({ user, error: false });
        } catch(e) {
            next(e)
        }
    },
    listAll: async (req, res, next) => {
        try {
            const users = await User.find(null, {_id: 1, active: 1, createdAt: 1});

            if(!users) throw new Error("ERR005")

            res.status(200).json({ users, error: false });
        } catch(e) {
            next(e)
        }
    }
};

module.exports = userController;
