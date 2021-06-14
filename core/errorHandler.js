module.exports = async (err, req, res, next) => {
    let statusCode
    let message
    let status
    let path
    let details = undefined

    // ERR002 - ERR005 são pertinentes a Users e Partners

    switch(err.message){
        case 'ERR001':
            statusCode = 400
            message = "Campo(s) mal formatados ou não enviados"
            status = "error"
            path = req.path
            details = {
                ...req.body.fieldsMalformatted
            }
        break;
        case 'ERR002':
            statusCode = 400
            message = "Usuário já cadastrado na plataforma"
            status = "error"
            path = req.path
        break;
        case 'ERR003':
            statusCode = 400
            message = "Falha ao cadastrar usuário"
            status = "error"
            path = req.path
        break;
        case 'ERR004':
            statusCode = 400
            message = "Falha ao tentar atualizar usuário"
            status = "error"
            path = req.path
        break;
        case 'ERR005':
            statusCode = 404
            message = "Usuário não encontrado"
            status = "error"
            path = req.path
        break;
        case 'ERR006':
            statusCode = 400
            message = "Falha ao cadastrar produto"
            status = "error"
            path = req.path
        break;
        case 'ERR007':
            statusCode = 400
            message = "Falha ao tentar atualizar produto"
            status = "error"
            path = req.path
        break;
        case 'ERR008':
            statusCode = 400
            message = "Falha ao tentar deletar produto"
            status = "error"
            path = req.path
        break;
        case 'ERR009':
            statusCode = 404
            message = "Produto(s) não encontrado(s)"
            status = "error"
            path = req.path
        break;
    }

    res.status(statusCode).json({
        statusCode,
        message,
        status,
        errorCode: err.message,
        details,
        path
    })
}