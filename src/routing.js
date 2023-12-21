let express=require("express")
require("dotenv").config()
require("./config/database").connect()
const jwt=require('jsonwebtoken')
const VerifyTOken=require('./middleware/authontication')
const bcrypt=require("bcrypt")
const nodemailer = require('nodemailer');
let customer=require("./models/user1")
let formidable=require("express-formidable")
const crypto=require('crypto')


let router=express.Router()


router.post ('/register',formidable(), async function (req,res){

  let { firstName,Lastname,email,password}=req.fields

  if(! (firstName && Lastname && email && password)){
    res.status(400).send('provide all the input')
  }else{

    if( await customer.findOne({email})){
      res.send("email already exist")
    }else{

      let enc_password= await bcrypt.hash(password,10)

      let user= await customer.create({
        firstName: firstName,
        Lastname: Lastname,
        email:email,
        password:enc_password,
        
      })

      let token=jwt.sign({user_id:user._id,email},
        process.env.TOKEN_KEY,
       {expiresIn:"5h"} )

       user.token=token
      res.json(user)

    }
    
  }
}
)


  router.post('/login',formidable(),async function(req,res){
    let {email,password}=req.fields
    if(!(email,password)){
      res.status(400).send("provide correct input")
    }
    else{
      let user=await customer.findOne({email})
  
      if(user && (await bcrypt.compare(password,user.password))){
        let token=jwt.sign({user_id:user._id,email},
          process.env.TOKEN_KEY,
          {expiresIn:"5h"})
          user.token=token
          res.json(user)       
      }
      else{
        res.status(400).send("inncorect username and password")
      }
    }
  })
  
   


 


  
  // Create Nodemailer transporter (replace with your Gmail credentials)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  
  async function sendEmail(options) {
    try {
      await transporter.sendMail(options);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
  





  
  router.post('/forgot-password', formidable(), async function (req, res) {
    const { email } = req.fields;
  
    try {
      // Validate email
      if (!email) {
        return res.status(400).send('Email is required');
      }
  
      // Find user by email
      const user = await customer.findOne({ email });
  
      if (!user) {
        return res.status(400).send('User not found');
      }
  
      // Generate a unique reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
        
      // Set expiration for the reset token (e.g., 1 hour)
      const resetTokenExpiration = Date.now() + 3600000;
  
      // Update user with reset token and expiration
      await user.updateOne({
        $set: {
          resetToken,
          resetTokenExpiration,
        },
      });
  
      // Send email with reset link
      await sendEmail({
        to: email,
        subject: 'Password Reset',
        text: `Click this link to reset your password: http://localhost:3000/api/reset-password/${resetToken}`,
      });
      
      res.send('Password reset email sent');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error processing request');
    }
  });
  
  





  router.get('/reset-password/:token', async function (req, res) {
    try {
      // Validate token
      const decoded = jwt.verify(req.params.token, process.env.TOKEN_KEY);
      const userId = decoded.user_id;
  
      // Find user
      const user = await customer.findById(userId);
  
      if (!user || user.resetToken !== req.params.token || user.resetTokenExpiration < Date.now()) {
        return res.status(400).send('Invalid or expired token');
      }
  
      // Token is valid, render the password reset form
      res.render('reset-password', { token: req.params.token });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error processing request');
    }
  });
  
  router.post('/reset-password/:token', async function (req, res) {
    try {
      // Validate token (again, for security)
      const decoded = jwt.verify(req.params.token, process.env.TOKEN_KEY);
      const userId = decoded.user_id;
  
      // Find user
      const user = await customer.findById(userId);
  
      if (!user || user.resetToken !== req.params.token || user.resetTokenExpiration < Date.now()) {
        return res.status(400).send('Invalid or expired token');
      }
  
      // Hash new password
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
  
      // Update password and clear reset token
      await user.updateOne({
        $set: {
          password: hashedPassword,
          resetToken: undefined,
          resetTokenExpiration: undefined,
        },
      });
  
      res.send('Password reset successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error processing request');
    }
  });







router.post('/products',VerifyTOken,formidable() ,function(req,res){
  res.send("hello  welocme to profile")
})



 module.exports=router
















//  router.post('/reset-password/:token', async function (req, res) {
//   const { token, newPassword } = req.body;

//   try {
//     // Validate token
//     const decoded = jwt.verify(token, process.env.TOKEN_KEY);
//     const userId = decoded.user_id;

//     // Find user
//     const user = await customer.findById(userId);

//     if (!user || user.resetToken !== token || user.resetTokenExpiration < Date.now()) {
//       return res.status(400).send('Invalid or expired token');
//     }

//     // Hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update password and clear reset token
//     await user.updateOne({
//       $set: {
//         password: hashedPassword,
//         resetToken: undefined,
//         resetTokenExpiration: undefined,
//       },
//     });

//     res.send('Password reset successfully');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error processing request');
//   }
// });

