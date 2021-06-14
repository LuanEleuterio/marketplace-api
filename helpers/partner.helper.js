const partnerHelper = {
    verifyFieldsBody: async (body) =>{
        let fieldsNotFounds = []
        if(!body.name)
            fieldsNotFounds.push("name")
         
        if(!body.email)
            fieldsNotFounds.push("email")
             
        if(!body.phone)
            fieldsNotFounds.push("phone") 

        if(!body.password)
            fieldsNotFounds.push("password")

        if(!body.address)
            fieldsNotFounds.push("address")
 
        if(!body.address?.street)
            fieldsNotFounds.push("address.street")

        if(!body.address?.number)
            fieldsNotFounds.push("address.number")

        if(!body.address?.city)
            fieldsNotFounds.push("address.city")

        if(!body.address?.state)
            fieldsNotFounds.push("address.state")

        if(!body.address?.postCode)
            fieldsNotFounds.push("address.postCode")
 
        return fieldsNotFounds
    }
}

module.exports = partnerHelper
