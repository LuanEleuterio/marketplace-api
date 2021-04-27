const api = require("../core/apiJuno")

const balanceController = {
    getBalance: async (req, res, next) => {
        const config = {
            apiVersion: '2',
            privateToken: '8F083AB3AB3238C834CCE17BC37F02B869CE6D951CF2EF3F70410CC15A34FF31',
            authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJsdWFuZWxldXRlcmlvM0BnbWFpbC5jb20iLCJzY29wZSI6WyJhbGwiXSwiZXhwIjoxNjE5NTMwODEwLCJqdGkiOiJWdzlnN0IxWXk5N1hETU92ZEFFZ0NTZ3ZBU0kiLCJjbGllbnRfaWQiOiJrdXF1a1c4MWFTV3lxQVM0In0.SxR92qn8Ab0zCohAKKGyJiLHLPFpkSgYhmbyb_UYxKaCHByTN5VFJQvW9gnReCYJkuqfg_o4GLkdg1S8e95nOQsegZ4cRljB6vpEGvoZABm5lsdUP-41f-_TFRJgksoPqiCIVMDOkcUA-mJHnyGSEOAhegoxQduIynAylWgYcRWnRR11vGT_LUSeQrIguFG_XTjKx9LWNtZ8Pv4Ve_hFpUDlUiCBFXFoLCZ2qmPHZkMtOwzZDRtRP9w2fsERt6BSMWXa_AnuCjlcfh6md3rAitNV2S56IxLL2N5zn2bUcZ9bHL_LygSP2aV0sM4tDUvZhqMuCGo0W2F4f2UeRVeXmg'
        }

        let request = await api("GET", "/balance", {}, config)

        res.json(request.data)
    }
} 


module.exports = balanceController
