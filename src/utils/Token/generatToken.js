import jwt from 'jsonwebtoken'



export  const generatToken = async({payload,sec_key,options}={})=>{

    return jwt.sign(payload,sec_key,options)
}
 
