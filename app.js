const express = require('express')
const mongoose =require('mongoose')
const path = require('path');
const methodOverride =require('method-override');
const Listing =require("./models/listing.js")
const ejsMate= require('ejs-mate')
const wrapAsync =require('./utils/WrapAsync.js')
const expressErrors =require('./utils/ExpressErrors.js')
const{listingSchema}=require("./schema.js")

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


  let validate = (req,res,next)=>{
     let {error}=listingSchema.validate(req.body)

if(error){
   let errMsg=error.details.map((el)=>el.message).join(",");
   throw new expressErrors(400,errMsg)
}else{
   next()
}
  }
  
app.get("/",(req,res)=>{
  
  res.send("root route")
})

app.get("/listing",async(req,res)=>{
   const all = await Listing.find({})

   res.render("listings/all.ejs",{all})
})

app.get("/listing/new",async(req,res)=>{
  
   res.render("listings/new.ejs")
})


app.get("/listing/:id",async(req,res,next)=>{
    let {id}=req.params;
   const list = await Listing.findById(id)

   res.render("listings/show.ejs",{list})
})

app.post("/listing",validate,wrapAsync(async(req,res)=>{


   const newListing=new Listing(req.body.listing)
   await newListing.save();

   res.redirect("/listing")

}))


app.get("/listing/:id/edit",async(req,res)=>{
    let {id}=req.params;
   const list = await Listing.findById(id)

   res.render("listings/edit.ejs",{list})
})

app.put("/listing/:id",validate,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})

 res.redirect(`/listing/${id}`)
}))

app.delete("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id)

 res.redirect(`/listing`)
})





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