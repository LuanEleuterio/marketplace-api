const bcrypt = require("bcryptjs")
const generateToken = require('../core/generateToken')
const User = require('../models/user.model')
const Partner = require('../models/partner.model')

const authenticateController = {
    getAuth: async (req, res, next) => {
        try{
            const {email, password, userOrPartner} = req.body
            let user

            if(userOrPartner === "USER"){
                user = await User.findOne({ email }, {_id: 1, name: 1}).select('+password')
            }else{
                user = await Partner.findOne({ email }, {_id: 1, name: 1}).select('+password')
            }
            
            if(!user){
                return res.status(404).json({message: 'User not found', error: true})
            }
            if(!await bcrypt.compare(password, user.password)){
                return res.status(400).json({message: 'User or password incorret', error: true})
            }

            const token = await generateToken({id: user._id, userOrPartner: userOrPartner})
            
            res.status(200).json({userId: user._id, token, type: userOrPartner, error: false})
        }catch(err){
            res.status(400).json({error: err.stack})
        }
    }
} 

module.exports = authenticateController
