import mongoose from "mongoose";


const messageSchema= new mongoose.Schema({
title:{
    type:String,
    required:true,
    trim:true,
    minLength:1
},
content:{
    type:String,
    trim:true,
    minLength:1
},
user_Id:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true,
}
},{    timestamps: true,
})


 const messageModel= mongoose.model.Message||mongoose.model("Message",messageSchema)
 export default messageModel