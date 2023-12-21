require("dotenv").config()
let express=require("express")
// require("./src/config/database").connect()
const app=express()
let Api=require("./src/routing")
// let customer=require("./src/models/user1")

// let formidable=require("express-formidable")

const PORT=process.env.API_PORT


app.use('/api',Api)















app.listen(PORT,()=>console.log(`the port is running at ${PORT}`))