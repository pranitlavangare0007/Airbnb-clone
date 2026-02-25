const express = require('express')
const router = express.Router();
const wrapAsync =require('../utils/WrapAsync.js')

const Listing =require('../models/listing.js')
const {isLoggedIn ,isOwner ,validateListing}=require('../middleware.js')

 

router.get("/",async(req,res)=>{
   const all = await Listing.find({})

   res.render("listings/all.ejs",{all})
})

router.get("/new", isLoggedIn ,async(req,res)=>{
  
   res.render("listings/new.ejs")
})


router.get("/:id",async(req,res,next)=>{
    let {id}=req.params;
   const list = await Listing.findById(id).populate({path: "reviews" ,
      populate:{path:"author"}
   }).populate("owner")

   if(!list){
 req.flash("error","Requested Listing does Not Exists!")
  return res.redirect("/listing")
   }

   res.render("listings/show.ejs",{list})
})

router.post("/",isLoggedIn,validateListing,wrapAsync(async(req,res)=>{


   const newListing=new Listing(req.body.listing)
   newListing.owner=req.user._id;
   await newListing.save();
   req.flash("success","New Listing Created")
   res.redirect("/listing")

}))


router.get("/:id/edit", isLoggedIn,isOwner,async(req,res)=>{
    let {id}=req.params;
   const list = await Listing.findById(id)
 if(!list){
 req.flash("error","Requested Listing does Not Exists!")
  return res.redirect("/listing")
   }

   res.render("listings/edit.ejs",{list})
})

router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;

   
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
req.flash("success"," Listing Updated!")
 res.redirect(`/listing/${id}`)
}))

router.delete("/:id", isLoggedIn,isOwner,async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id)
req.flash("success"," Listing Deleted")
 res.redirect(`/listing`)
})

module.exports=router;
