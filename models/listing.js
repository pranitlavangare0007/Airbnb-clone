const mongoose =require('mongoose')
const Schema = mongoose.Schema;

const listingSchema = new Schema({

    title: String,
    description:String,
   image: {
        filename: String,
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1505691938895-1758d7feb511"
        }
    },
    price:Number,
    location:String,
    country:String

})

const Listing =mongoose.model("Listing",listingSchema)
module.exports=Listing;