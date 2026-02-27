const Listing = require('../models/listing.js')

module.exports.index = async(req,res)=>{
   const all = await Listing.find({})

   res.render("listings/all.ejs",{all})
}

module.exports.renderNewForm = async(req,res)=>{
  
   res.render("listings/new.ejs")
}

module.exports.showListing = async(req,res,next)=>{
    let {id}=req.params;
   const list = await Listing.findById(id).populate({path: "reviews" ,
      populate:{path:"author"}
   }).populate("owner")

   if(!list){
 req.flash("error","Requested Listing does Not Exists!")
  return res.redirect("/listing")
   }

   res.render("listings/show.ejs",{list})
}

module.exports.createNewListing = async(req,res)=>{


   const newListing=new Listing(req.body.listing)
   newListing.owner=req.user._id;
   await newListing.save();
   req.flash("success","New Listing Created")
   res.redirect("/listing")

}

module.exports.renderEditform = async(req,res)=>{
    let {id}=req.params;
   const list = await Listing.findById(id)
 if(!list){
 req.flash("error","Requested Listing does Not Exists!")
  return res.redirect("/listing")
   }

   res.render("listings/edit.ejs",{list})
}

module.exports.updateListing = async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
req.flash("success"," Listing Updated!")
 res.redirect(`/listing/${id}`)
}

module.exports.deleteListing = async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id)
req.flash("success"," Listing Deleted")
 res.redirect(`/listing`)
}