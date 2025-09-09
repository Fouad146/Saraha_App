import mongoose from "mongoose"



const chickConniction=async()=>{
await mongoose.connect(process.env.DATABASE_CONECTION).then(()=>{
console.log("DB Connicted");
}).catch((err)=>{
    console.log("fail to Connect DB");
    })
}

export default chickConniction