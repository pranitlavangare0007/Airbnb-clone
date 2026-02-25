const Listing =require('./models/listing.js')
const{listingSchema,reviewSchema}=require("./schema.js")
const expressErrors =require('./utils/ExpressErrors.js')
const Review=require('./models/review.js')

module.exports.isLoggedIn = (req,res,next)=>{
   
    if( !req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl;
   req.flash("error","you must be logged in to create lising")
  return res.redirect("/login")
  }
  next()
}

module.exports.savedRedirecturl= (req,res,next)=>{
    if( req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl;
    }
    next()
}

module.exports.isOwner = async(req,res,next)=>{
    let {id}=req.params;

    let listing = await Listing.findById(id);
    if( res.locals.currentUser && !listing.owner._id.equals(res.locals.currentUser._id)){
      req.flash("error","you dont have permission to edit")
     return res.redirect(`/listing/${id}`)
    }
    next()
   
}


module.exports.validateListing = (req,res,next)=>{
     let {error}=listingSchema.validate(req.body)

if(error){
   let errMsg=error.details.map((el)=>el.message).join(",");
   throw new expressErrors(400,errMsg)
}else{
   next()
}
  }

  module.exports.validateReview = (req,res,next)=>{
       let {error}=reviewSchema.validate(req.body)
  
  if(error){
     let errMsg=error.details.map((el)=>el.message).join(",");
     throw new expressErrors(400,errMsg)
  }else{
     next()
  }
    }


    
module.exports.isAuthor = async(req,res,next)=>{
    let {reviewId ,id}=req.params;

    let review = await Review.findById(reviewId);
    if( res.locals.currentUser && !review.author._id.equals(res.locals.currentUser._id)){
      req.flash("error","you dont have permission to edit")
     return res.redirect(`/listing/${id}`)
    }
    next()
   
}
    
  