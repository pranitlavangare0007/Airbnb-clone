const User = require('../models/user.js')

module.exports.rendernSignupForm = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signUp = async(req,res)=>{
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
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login = async(req,res)=>{
            req.flash("success","loggedin")
            let redirect = res.locals.redirecturl || "/listing"
            res.redirect(redirect)
  
}

module.exports.logOut = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success","user logged out ")
        res.redirect("/listing")
    })
}