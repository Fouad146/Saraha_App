import jwt from 'jsonwebtoken'



export  const verifyToken = async({token, sec_key}={})=>{

    return jwt.verify(token, sec_key)
}
 
