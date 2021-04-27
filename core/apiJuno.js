const axios = require("axios")

module.exports = async (method, url, data = {}, config = {}) => {
    let header = {}

    config?.apiVersion    ? header["X-Api-Version"] = config.apiVersion : null
    config?.privateToken  ? header["X-Resource-Token"] = config.privateToken : null
    config?.authorization ? header["Authorization"] = config.authorization : null

    const request = await axios.create({
        baseURL: `https://sandbox.boletobancario.com/api-integration`,
        headers: header
    })

    let instance;

    switch(method){
        case 'get': instance = request.get;
        case 'post': instance = request.post;
        case 'put': instance = request.put;
        case 'patch': instance = request.patch;
        case 'delete': instance = request.delete;
        default: instance = request.get;
    }

    return instance(url, data, config)
    .catch(err => {
        console.log(err)
    })

}