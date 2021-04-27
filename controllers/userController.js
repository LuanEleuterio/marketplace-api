const User = require('../models/user')
const generateToken = require('../core/generateToken')

const userController = {
    register: async (req, res, next) => {
        const { email } = req.body

        try{
            if(await User.findOne({email})){
                return res.status(400).send({error: "User already exists"})
            }

            const user = await User.create(req.body)

            user.password = undefined

            return res.send(user)
        } catch(err){
            return res.status(400).send({error: "Registration failed"})
        }
    }
}

module.exports = userController