import bcrypt from "bcrypt";


export const compare=async({plainText,compareText}={})=>{
return bcrypt.compareSync(plainText, compareText)
}