const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utills/wrapAsync.js");
const ExpressError = require("../utills/ExpressError.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

const {validateReview, isLoggedIn, isreviewAuthor} = require("../middleware.js");








//rewies
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let listings= await Listing.findById(req.params.id);
    let newRewies = new Review(req.body.review);
    newRewies.author = req.user._id;
 listings.reviews.push(newRewies);

 console.log(newRewies);
   await newRewies.save();
await listings.save();

req.flash("success","New Review Created!");
res.redirect(`/listings/${listings._id}`);
}));


//rewooies delete
router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(async(req,res)=>{
    try{
    let { id, reviewId } = req.params;

console.log(id);
console.log(reviewId);

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    
req.flash("success","Review Deleted!");
   
        res.redirect(`/listings/${id}`);    
}
catch(error)
{
console.log(error);
}
}));

module.exports = router;