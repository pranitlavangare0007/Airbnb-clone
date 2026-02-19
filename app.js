const express = require('express')
const mongoose =require('mongoose')
const path = require('path');
const methodOverride =require('method-override');
const Listing =require("./models/listing.js")
const Review=require('./models/review.js')
const ejsMate= require('ejs-mate')
const wrapAsync =require('./utils/WrapAsync.js')
const expressErrors =require('./utils/ExpressErrors.js')
const{listingSchema,reviewSchema}=require("./schema.js")
const listing = require('./routes/listing.js')
const review = require('./routes/review.js')

const port =8080
const app=express();
app.engine('ejs', ejsMate);
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended :true}))
app.use(methodOverride("_method"));
const cookieParser = require('cookie-parser')
mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
  .then(() => console.log('Connected!')).catch((err)=>{
    console.log(err)
  });

  

app.use(cookieParser())
app.get("/getCookie",(req,res)=>{
   res.cookie("hii","pranit")
   res.send("hellow")
   
})

  
app.get("/",(req,res)=>{
  console.log(req.cookies)
  res.send("root route")
})

app.use("/listing",listing);
app.use("/listing/:id/review",review);


// add review




// app.get("/",(req,res)=>{
//     res.send("hii")
// })

// app.get("/test",async(req,res)=>{
//    let sample= new Listing({
//   title: "Cozy Mountain Cabin",
//   description: "A beautiful wooden cabin with scenic mountain views, perfect for a peaceful getaway.",
//   price: 4500,
//   location: "Manali",
//   country: "India"
//    })
//    await sample.save();
//    res.send("saved")
// })

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