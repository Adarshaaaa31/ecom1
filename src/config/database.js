const mongoose=require("mongoose")
const MONGO_URI= process.env.MONGO_URI


mongoose.connect(MONGO_URI)
.then(()=>console.log('connected'))
.catch(()=>console.log("not connected"))

exports.connect=()=>{
    mongoose.connect(MONGO_URI)
.then(()=>console.log('connected'))
.catch(()=>console.log("not connected"))
}