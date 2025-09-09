import bcrypt from "bcrypt";


export const hashing=async({plainText,saltOrRounds}={})=>{
return bcrypt.hashSync(plainText, Number(saltOrRounds))
}