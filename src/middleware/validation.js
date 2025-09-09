


export const valdation=(schema)=>{
    let validationEror=[]
    return(req,res,next)=>{
        for (const key in schema) {
            const {value,error} =schema[key].validate(req[key],{abortEarly:false})
            if (error) {
                validationEror.push(error.details)
        }
}
if (validationEror.length) {
    return res.status(404).send({message:"validationEror",validationEror})
}
return next()
    }
}