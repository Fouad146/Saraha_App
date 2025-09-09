import mongoose from "mongoose";


const reveokTokenSchema= new mongoose.Schema({
tokenId:{
    type:String,
    required:true,

},
expireAt:{
    type:String,
    required:true,

},
},{    timestamps: true,
})


 const reveokTokenModel= mongoose.model.ReveokToken||mongoose.model("ReveokToken",reveokTokenSchema)
 export default reveokTokenModel