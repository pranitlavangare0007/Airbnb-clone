const express = require('express')
const mongoose =require('mongoose')
const path = require('path');
const methodOverride =require('method-override');
const Listing =require("./models/listing.js")
const Review=require('./models/review.js')
const ejsMate= require('ejs-mate')
const wrapAsync =require('./utils/WrapAsync.js')
const expressErrors =require('./utils/ExpressErrors.js')

const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')

const session =require('express-session')
const flash =require('connect-flash')
const passport = require('passport')
const LocalStratergy=require('passport-local')
const User =require('./models/user.js')

const port =8080
const app=express();
app.engine('ejs', ejsMate);
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended :true}))
app.use(methodOverride("_method"));

mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
  .then(() => console.log('Connected!')).catch((err)=>{
    console.log(err)
  });

  
const sessionOption={
  secret:"secretkru",
   resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now() + 1000*60*10,
    maxAge:1000*60*10,
    httpOnly:true,

  }
}

app.use(session(sessionOption))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStratergy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

  

app.use((req,res,next)=>{
  res.locals.success= req.flash("success")
  res.locals.error= req.flash("error")
  res.locals.currentUser=req.user;
  next();
})

// app.get("/demo", async(req,res)=>{

//  let fakeUser = new User({
//   email:"pranit@gmail.com",
//   username:"sigma"
//  })
//   let registeredUser = await User.register(fakeUser,"123")
//   res.send(registeredUser)

// })


app.use("/listing",listingRouter);
app.use("/listing/:id/review",reviewRouter);
app.use("/",userRouter);



app.use((req,res,next)=>{
   next(new expressErrors(404,"page not found"))
})

app.use((err,req,res,next)=>{
  let{statusCode=500,message}=err;

  res.status(statusCode).render("error.ejs",{message})
//   res.status(statusCode).send(message);
})

app.listen(port,()=>{
    console.log(`running on ${port}`)
})