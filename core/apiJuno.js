const axios = require("axios")

module.exports = async (method, url, data = {}, config = {}) => {
    let header = {}

    config?.apiVersion    ? header["X-Api-Version"] = config.apiVersion : null
    config?.resourceToken ? header["X-Resource-Token"] = config.resourceToken : null
    config?.authorization ? header["Authorization"] = config.authorization : null

    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

    const request = await axios.create({
        baseURL: `https://sandbox.boletobancario.com/api-integration`,
        headers: header
    })

    let instance;

    switch(method.toLowerCase()){
        case 'get': instance = request.get; break;
        case 'post': instance = request.post; break;
        case 'put': instance = request.put; break;
        case 'patch': instance = request.patch; break;
        case 'delete': instance = request.delete; break;
        default: instance = request.get;
    }

    return instance(url, data, config)
    .catch(err => {
        return err.response
    })

}