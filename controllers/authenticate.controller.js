const bcrypt = require("bcryptjs")
const {generateToken , generateTokenAdm} = require('../core/generateToken')
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
                throw new Error('ERR005')
            }
            if(!await bcrypt.compare(password, user.password)){
                throw new Error('ERR026')
            }

            const token = await generateToken({id: user._id, userOrPartner: userOrPartner})
            
            res.status(200).json({userId: user._id, token, type: userOrPartner, error: false})
        }catch(e){
            next(e)
        }
    },
    getAuthAdm: async (req, res, next) => {
        try{
            console.log(req.body)
            const {email, userOrPartner, otherInfo} = req.body

            const token = await generateTokenAdm({email, userOrPartner, otherInfo})
            
            res.status(200).json({token})
        }catch(e){
            next(e)
        }
    }
} 

module.exports = authenticateController
