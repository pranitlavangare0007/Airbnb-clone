const express = require('express')
const router = express.Router({mergeParams:true});
const {validateReview, isLoggedIn, isAuthor}=require('../middleware.js')
const Review=require('../models/review.js')
const wrapAsync =require('../utils/WrapAsync.js')
const Listing =require("../models/listing.js")




router.post("/",isLoggedIn , validateReview ,wrapAsync(async(req,res)=>{
   let {id}=req.params;
   let listing = await Listing.findById(id);
   let newreview = new Review(req.body.review);
   newreview.author=req.user._id;

   listing.reviews.push(newreview)
   console.log(newreview)
  await newreview.save();
  await listing.save();

 req.flash("success","New Review created")
 res.redirect(`/listing/${id}`)
}))

//delete review

router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(async(req,res)=>{
   let{id,reviewId}=req.params;

   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})

   await Review.findByIdAndDelete(reviewId);
   req.flash("success","Review Deleted!")
   res.redirect(`/listing/${id}`);

}))


module.exports=router;
