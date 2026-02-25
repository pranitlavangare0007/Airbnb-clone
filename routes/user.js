const express = require('express')
const router = express.Router({mergeParams:true});
const User = require('../models/user.js')
const wrapAsync =require('../utils/WrapAsync.js');
const passport = require('passport');
const { savedRedirecturl } = require('../middleware.js');

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
let {username,email,password}=req.body;
 const newUser=  new User({email,username})
 let registeredUser = await User.register(newUser,password)
 console.log(registeredUser)
 req.login(registeredUser,(err)=>{
        if(err){
           return next(err)
        }
        req.flash("success","user logged in ")
        res.redirect("/listing")
    })

    }
    catch(err){
       req.flash("error",err.message) 
       res.redirect("/signup")
    }
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})

router.post("/login",savedRedirecturl,
     passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true}),
        async(req,res)=>{
            req.flash("success","loggedin")
            let redirect = res.locals.redirecturl || "/listing"
            res.redirect(redirect)
  
})

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success","user logged out ")
        res.redirect("/listing")
    })
})

module.exports=router;