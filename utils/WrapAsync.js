module.exports=(fn)=>{
    return(res,req)=>{
        fn(req,res,next).catch(next)
    }
}