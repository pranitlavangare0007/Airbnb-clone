const express = require('express')
const router = express.Router({mergeParams:true});
const expressErrors =require('../utils/ExpressErrors.js')
const{listingSchema,reviewSchema}=require("../schema.js")
const Review=require('../models/review.js')
const wrapAsync =require('../utils/WrapAsync.js')
const Listing =require("../models/listing.js")

let validateReview = (req,res,next)=>{
     let {error}=reviewSchema.validate(req.body)

if(error){
   let errMsg=error.details.map((el)=>el.message).join(",");
   throw new expressErrors(400,errMsg)
}else{
   next()
}
  }



router.post("/", validateReview ,wrapAsync(async(req,res)=>{
   let {id}=req.params;
   let listing = await Listing.findById(id);
   let newreview = new Review(req.body.review);

   listing.reviews.push(newreview)
  await newreview.save();
  await listing.save();

 
 res.redirect(`/listing/${id}`)
}))

//delete review

router.delete("/:reviewId",wrapAsync(async(req,res)=>{
   let{id,reviewId}=req.params;

   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})

   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listing/${id}`);

}))


module.exports=router;
