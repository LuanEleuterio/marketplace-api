const productHelper = {
    verifyFieldsBody: async (body) =>{
        let fieldsNotFounds = []
        if(!body.name)
            fieldsNotFounds.push("name")
         
        if(!body.description)
            fieldsNotFounds.push("description")
             
        if(!body.price)
            fieldsNotFounds.push("price") 

        if(!body.qtd)
            fieldsNotFounds.push("qtd")

        if(!body.details)
            fieldsNotFounds.push("details")
 
        if(!body.details?.marca)
            fieldsNotFounds.push("details.marca")

        if(!body.details?.manufacturer)
            fieldsNotFounds.push("details.manufacturer")

        if(!body.details?.model)
            fieldsNotFounds.push("details.model")

        if(!body.details?.color)
            fieldsNotFounds.push("details.color")

        if(!body.details?.capacity)
            fieldsNotFounds.push("details.capacity")
        
        if(!body.details?.weight)
            fieldsNotFounds.push("details.weight")
        
        if(!body.details?.dimension)
            fieldsNotFounds.push("details.dimension")
        
        if(!body.details?.dimension?.height)
            fieldsNotFounds.push("details.dimension.height")
            
        if(!body.details?.dimension?.width)
            fieldsNotFounds.push("details.dimension.width")
            
        if(!body.details?.dimension?.comprimento)
            fieldsNotFounds.push("details.dimension.comprimento")
 
        return fieldsNotFounds
    }
}

module.exports = productHelper
