const mongoose =require('mongoose')
const initData =require("./data.js")

const Listing =require("../models/listing.js")

mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
  .then(() => console.log('Connected!')).catch((err)=>{
    console.log(err)
  });

  const initDb = async()=>{
    await Listing.deleteMany({})
   initData.data = initData.data.map((obj)=>({...obj,owner:'699e5623be85693d925f7f6f'}))
    await Listing.insertMany(initData.data)
    console.log("saved")
  }

  initDb();