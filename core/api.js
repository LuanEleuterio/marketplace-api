const axios = require("axios")

module.exports = async (method, baseUrl, endpoint, data = {}, config = {}) => {
    let header = {}

    config?.apiVersion    ? header["X-Api-Version"] = config.apiVersion : null
    config?.resourceToken ? header["X-Resource-Token"] = config.resourceToken : null
    config?.authorization ? header["Authorization"] = config.authorization : null

    const request = await axios.create({
        baseURL: baseUrl,
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

    return instance(endpoint, data, config)
    .catch(err => {
        return err.response
    })

}