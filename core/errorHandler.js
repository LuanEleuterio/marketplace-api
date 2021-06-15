module.exports = async (err, req, res, next) => {
    let statusCode
    let message
    let status
    let path
    let details = undefined
    let error = false

    // ERR002 - ERR005 erros pertinentes a Users e Partners
    // ERR006 - ERR009 erros pertinentes a Products
    // ERR010 - ERR014 erros pertinentes a Orders
    // ERR016 - ERR022 erros pertinentes a integração com Juno
    // ERR023 - ERR025 erros pertinentes a Cards
    // ERR027 - ERR030 erros pertinentes a Token

    switch(err.message){
        case 'ERR001':
            statusCode = 400
            message = "Campo(s) mal formatados ou não enviados"
            status = "error"
            path = req.path
            details = {
                ...req.body.fieldsMalformatted
            }
            error = true
        break;
        case 'ERR002':
            statusCode = 400
            message = "Usuário já cadastrado na plataforma"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR003':
            statusCode = 400
            message = "Falha ao cadastrar usuário"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR004':
            statusCode = 400
            message = "Falha ao tentar atualizar usuário"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR005':
            statusCode = 404
            message = "Usuário não encontrado"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR006':
            statusCode = 400
            message = "Falha ao cadastrar produto"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR007':
            statusCode = 400
            message = "Falha ao tentar atualizar produto"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR008':
            statusCode = 400
            message = "Falha ao tentar deletar produto"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR009':
            statusCode = 404
            message = "Produto(s) não encontrado(s)"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR010':
            statusCode = 400
            message = "Falha ao criar Order"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR012':
            statusCode = 400
            message = "Falha ao atualizar Order"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR013':
            statusCode = 400
            message = "Falha ao cancelar Order"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR014':
            statusCode = 404
            message = "Order não encontrada"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR015':
            statusCode = 400
            message = "Falha ao criar Charge"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR016':
            statusCode = 400
            message = "Falha ao criar Charge na Juno"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR017':
            statusCode = 400
            message = "Falha ao cancelar Charge na Juno"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR018':
            statusCode = 400
            message = "Falha ao criar Conta Digital na Juno"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR019':
            statusCode = 400
            message = "Falha ao criar Payment na Juno"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR020':
            statusCode = 400
            message = "Falha ao cancelar Payment na Juno"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR021':
            statusCode = 400
            message = "Falha ao criar Card Tokenizado na Juno"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR022':
            statusCode = 400
            message = "Falha ao buscar informações na Juno"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR023':
            statusCode = 400
            message = "Falha ao criar Card"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR024':
            statusCode = 400
            message = "Falha ao deletar Card"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR025':
            statusCode = 404
            message = "Cards não encontrados"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR026':
            statusCode = 400
            message = "Email ou senha incorreto"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR027':
            statusCode = 400
            message = "No token provided"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR028':
            statusCode = 400
            message = "Token error"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR029':
            statusCode = 400
            message = "Token malformatted"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR030':
            statusCode = 400
            message = "Token invalid"
            status = "error"
            path = req.path
            error = true
        break;
        case 'ERR031':
            statusCode = 403
            message = "Você não tem acesso a esse recurso"
            status = "error"
            path = req.path
            error = true
        break;
    }

    res.status(statusCode).json({
        statusCode,
        message,
        status,
        errorCode: err.message,
        details,
        path,
        error
    })
}