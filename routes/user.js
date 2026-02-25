const express = require('express')
const router = express.Router({mergeParams:true});
const User = require('../models/user.js')

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup", async(req,res)=>{
   let {username,email,password}=req.body;
 const newUser=  new User({email,username})
 let registeredUser = await User.register(newUser,password)
 console.log(registeredUser)
})

module.exports=router;