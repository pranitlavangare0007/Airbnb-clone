const Review=require('../models/review.js')
const Listing =require("../models/listing.js")

module.exports.newReview = async(req,res)=>{
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
}

module.exports.deleteReview = async(req,res)=>{
   let{id,reviewId}=req.params;

   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})

   await Review.findByIdAndDelete(reviewId);
   req.flash("success","Review Deleted!")
   res.redirect(`/listing/${id}`);

}