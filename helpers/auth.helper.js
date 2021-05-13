//Models
const Auth = require('../models/auth.model')

//Core
const api = require('../core/api')

const authHelper = {
    get: async () => {  
        let token
        let dateNow = new Date()
        let dateAt = Date.now()
        try{
            const auth = await Auth.findOne({id: "1"})
            //console.log("auth", auth)

            if(!auth){
                token = await getAuth()
                token.expires_milli = dateNow.setHours(dateNow.getHours() + 24)
                token.expires_date = token.expires_milli
                await Auth.create(token)
                return token.access_token
            }

            let dateExpireToken = new Date(parseInt(auth.expires_milli))

            if(dateNow.toLocaleString() > dateExpireToken.toLocaleString()){
                token = getAuth()
                token.expires_milli = dateNow.setHours(dateNow.getHours() + 21)
                token.expires_date = token.expires_milli
                await Auth.updateOne({id:'1'},token, function(err, res) {
                    if (err) res.send(err)
                })
                return token.access_token
            }

            return auth.access_token
        }catch(err){
            return err
        }  
    }   
}

async function getAuth(){
    const config = {}
    config['Content-Type'] = 'application/x-www-form-urlencoded'
    config['Authorization'] = `Basic ${process.env.AUTH_BASE64}`

    let body = `grant_type=client_credentials`

    const token = await api(
        "POST", 
        "https://sandbox.boletobancario.com",
        "/authorization-server/oauth/token", 
        body,
        config
    )
    console.log("getAuth HELPER", token.data)
    return token.data
}

module.exports = authHelper