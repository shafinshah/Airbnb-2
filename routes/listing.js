const express = require("express");
const router = express.Router();
const wrapAsync = require("../utills/wrapAsync.js");


const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListings} = require("../middleware.js");
//search
router.get("/search",async(req,res)=>{
    const query = req.query.search || '';
 
    
let query2 = query.toUpperCase();
const allListings = await Listing.find({});

  const list = await allListings.filter(allListings => allListings.title.toUpperCase() === query2);
    
  


    
   console.log(list);

  res.render("listings/search.ejs", {list})

});
//location
router.get("/location",async(req,res)=>{
    const query = req.query.search || '';

  let query2 = query.toUpperCase();

const allListings = await Listing.find({});
  const list = await allListings.filter(allListings =>allListings.location.toUpperCase() === query2);
    
    console.log(list);

  res.render("listings/search.ejs", {list})

});

//country
router.get("/country",async(req,res)=>{
    const query = req.query.search || '';
 
    
  let query2 = query.toUpperCase();

const allListings = await Listing.find({});
  const list = await allListings.filter(allListings => allListings.country.toUpperCase() === query2);
    
    console.log(list);

  res.render("listings/search.ejs", {list})

});

//price

router.get("/price",async(req,res)=>{
    const query = req.query.search || '';
 console.log(query);
    

const allListings = await Listing.find({});
  const list = allListings.filter((allListings) =>{
    return allListings.price <= query
  });
    
    console.log(list);

  res.render("listings/search.ejs", {list})

});

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