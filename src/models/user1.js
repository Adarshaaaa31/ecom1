const mongoose=require('mongoose')

const userSchema=new mongoose.Schema ({
    firstName:{type:String,default:''},
    Lastname:{type:String,default:''},
    email:{type:String,default:'' },
    password:{type:String,default:''},
    token:{type:String,default:''}
   
}) 

module.exports=mongoose.model("user",userSchema)