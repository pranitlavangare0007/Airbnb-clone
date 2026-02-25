const express = require('express')
const router = express.Router({mergeParams:true});
const {validateReview}=require('../middleware.js')
const Review=require('../models/review.js')
const wrapAsync =require('../utils/WrapAsync.js')
const Listing =require("../models/listing.js")




router.post("/", validateReview ,wrapAsync(async(req,res)=>{
   let {id}=req.params;
   let listing = await Listing.findById(id);
   let newreview = new Review(req.body.review);

   listing.reviews.push(newreview)
  await newreview.save();
  await listing.save();

 req.flash("success","New Review created")
 res.redirect(`/listing/${id}`)
}))

//delete review

router.delete("/:reviewId",wrapAsync(async(req,res)=>{
   let{id,reviewId}=req.params;

   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})

   await Review.findByIdAndDelete(reviewId);
   req.flash("success","Review Deleted!")
   res.redirect(`/listing/${id}`);

}))


module.exports=router;
