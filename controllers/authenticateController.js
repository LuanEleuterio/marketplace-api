const generateToken = require('../core/generateToken')
const User = require('../models/user')
const bcrypt = require("bcryptjs")

const authenticateController = {
    getAuth: async (req, res, next) => {
        const {email, password} = req.body

        const user = await User.findOne({ email }).select('+password')

        if(!user){
            return res.status(400).send({error: 'User not found'})
        }

        if(!await bcrypt.compare(password, user.password)){
            return res.status(400).send({error: 'User or password incorret'})
        }

        user.password = undefined

        const token = await generateToken({id: user.id})

        res.send({user, token})
    }
} 

module.exports = authenticateController
