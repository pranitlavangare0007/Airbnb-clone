const express = require('express')
const router = express.Router();
const wrapAsync =require('../utils/WrapAsync.js')
const{listingSchema,reviewSchema}=require("../schema.js")
const expressErrors =require('../utils/ExpressErrors.js')
const Listing =require("../models/listing.js")

 let validateListing = (req,res,next)=>{
     let {error}=listingSchema.validate(req.body)

if(error){
   let errMsg=error.details.map((el)=>el.message).join(",");
   throw new expressErrors(400,errMsg)
}else{
   next()
}
  }

router.get("/",async(req,res)=>{
   const all = await Listing.find({})

   res.render("listings/all.ejs",{all})
})

router.get("/new",async(req,res)=>{
  
   res.render("listings/new.ejs")
})


router.get("/:id",async(req,res,next)=>{
    let {id}=req.params;
   const list = await Listing.findById(id).populate("reviews")

   if(!list){
 req.flash("error","Requested Listing does Not Exists!")
  return res.redirect("/listing")
   }

   res.render("listings/show.ejs",{list})
})

router.post("/",validateListing,wrapAsync(async(req,res)=>{


   const newListing=new Listing(req.body.listing)
   await newListing.save();
   req.flash("success","New Listing Created")
   res.redirect("/listing")

}))


router.get("/:id/edit",async(req,res)=>{
    let {id}=req.params;
   const list = await Listing.findById(id)
 if(!list){
 req.flash("error","Requested Listing does Not Exists!")
  return res.redirect("/listing")
   }

   res.render("listings/edit.ejs",{list})
})

router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
req.flash("success"," Listing Updated!")
 res.redirect(`/listing/${id}`)
}))

router.delete("/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id)
req.flash("success"," Listing Deleted")
 res.redirect(`/listing`)
})

module.exports=router;
