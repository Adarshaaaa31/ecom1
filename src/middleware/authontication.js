require("dotenv").config()
const jwt=require('jsonwebtoken')
const VerifyTOken=(req,res,next)=>{

    const token=req.header('Authorization')
    if(!token){

   return res.status(403).send("valid token is required to visit the url")
} 
try{
    let Verify_Token=jwt.verify(token,process.env.TOKEN_KEY)
    req.user=Verify_Token
}
catch{
    return res.status(403).send("valid token is required to visit the url")
}
return next()
}

module.exports=VerifyTOken