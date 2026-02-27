const express = require('express')
const router = express.Router({mergeParams:true});
const {validateReview, isLoggedIn, isAuthor}=require('../middleware.js')
const Review=require('../models/review.js')
const wrapAsync =require('../utils/WrapAsync.js')
const Listing =require("../models/listing.js")
const reviewController = require('../controllers/reviews.js')




router.post("/",isLoggedIn , validateReview ,wrapAsync(reviewController.newReview))

//delete review

router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview))


module.exports=router;
