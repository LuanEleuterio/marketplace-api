const axios = require('axios')
const convert = require('xml-js')

function genQueryString(obj){
    return Object.getOwnPropertyNames(obj).map(key => `${key}=${obj[key]}`).join('&')
}


const correiosShipping = {
    calculate:  async (data) => {
        let largura = parseFloat(data.product.details.dimension.width) < 10 ? "10" : data.product.details.dimension.width
        let comprimento = parseFloat(data.product.details.dimension.comprimento) < 15 ? "15" : data.product.details.dimension.comprimento
        let valorDeclarado = (data.product.price * data.productQtd).toFixed(2)
       
        const correiosData = {
            nCdEmpresa: "",
            sDsSenha: "",
            nCdServico: "40010",
            sCepOrigem: data.partner.address.postCode,
            sCepDestino: "04917120",
            nVlPeso: (parseFloat(data.product.details.weight) / 1000).toFixed(3).toString(),
            nCdFormato: "1",
            nVlComprimento: comprimento,
            nVlAltura: data.product.details.dimension.height,
            nVlLargura: largura,
            nVlDiametro: "0",
            sCdMaoPropria: "n",
            nVlValorDeclarado: valorDeclarado.toString(),
            sCdAvisoRecebimento: "n"
        }
        
        let qs = genQueryString(correiosData)

        try{
            let response = await axios.get(`http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPrecoPrazo?${qs}`)
            .then(res => {   

                return convert.xml2json(res.data, {compact: true, spaces: 0});
            })

            let responseObj = JSON.parse(response)
            return responseObj
        }catch(err){
            return err.stack
        }
    }
}

module.exports = correiosShipping