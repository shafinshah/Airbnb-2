const express = require("express");
const router = express.Router();
const wrapAsync = require("../utills/wrapAsync.js");


const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListings} = require("../middleware.js");




//index
router.get("/",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    
    res.render("listings/index.ejs", { allListings });
}));

//new


router.get("/new",isLoggedIn,wrapAsync(async(req,res)=>{


    res.render("listings/new.ejs");
}));

//creat

router.post("/",isLoggedIn,validateListings,
    wrapAsync(async(req,res,next)=>{
    

    const newlisting = new Listing( req.body.listing);
    newlisting.owner = req.user._id;
await newlisting.save();
req.flash("success","New Listing Created!");
res.redirect("/listings");

}));

//show

router.get("/:id", wrapAsync(async(req,res)=>{
    let { id }= req.params;
    const listings = await Listing.findById(id).populate({ path:"reviews",populate: {
        path: "author",
    },
    })
    .populate("owner");

if(!listings){
    req.flash("error","Listing you requested for does not exist !");
    res.redirect("/listings");
}

res.render("listings/show.ejs",{ listings })
}));

//Edit

router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let { id }= req.params;
    const listings = await Listing.findById(id);

    
if(!listings){
    req.flash("error","Listing you requested for does not exist !");
    res.redirect("/listings");
}


res.render("listings/edit.ejs", { listings });
}));

//update


router.put("/:id",isLoggedIn,isOwner,validateListings, wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing")
    }
    let { id }= req.params;
   
await Listing.findByIdAndUpdate(id, {...req.body.listing});

req.flash("success","Listing Updated !");
res.redirect(`/listings/${id}`);
}));

//delete


router.delete("/:id",isLoggedIn ,isOwner,wrapAsync(async (req,res) => {
    let { id }= req.params;
    let deteted = await Listing.findByIdAndDelete(id);
    console.log(deteted);
    req.flash("success","Listing Deleted!");
    
res.redirect(`/listings`);

}));

module.exports = router;