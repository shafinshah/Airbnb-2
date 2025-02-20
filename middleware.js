const Listing = require("./models/listing");
const { listingSchema,reviewSchema} = require("./schema.js");
const { ExpressError } = require("./utills/ExpressError.js");
const Review = require("./models/reviews.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
    req.flash("error","you must be logged in to create and update listing");
   return res.redirect("/login");

}
next();
};

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let { id }= req.params;
    let listing = await Listing.findByIdAndUpdate(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit");
        res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListings = (req,res,next)=>{
    let { error } = listingSchema.validate(req.body);
    if(error){
        let errMsg =error.details.map((el)=>
            el.message).join(",");
           throw new ExpressError(400,errMsg);
        
    }else {
        next();
    }
};

 module.exports.validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let errMsg =error.details.map((el)=>
            el.message).join(",");
           throw new ExpressError(400,errMsg);
        
    }else {
        next();
    }
};

module.exports.isreviewAuthor = async(req,res,next)=>{
    let { id,reviewId }= req.params;
    let review = await Review.findByIdAndUpdate(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You did not creat this review");
       return res.redirect(`/listings/${id}`);
    }
    next();
};

