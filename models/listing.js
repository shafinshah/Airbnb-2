const mongoose = require("mongoose");
const Review = require("./reviews.js");
const { string, ref } = require("joi");
const Schema = mongoose.Schema;
const User = require("./user.js");

const listingSchema = new Schema({
    title: {
        type: String,
        require : true
    },
    description : String,
    image:{

type: String,
default:
     "https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/5a/16/f3/46/52/v1_E10/E10C05EQ.jpg?w=1600&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=654914541ae97e998a64b5c78566b9857dc3bbbeabb8415ac91aa84d47c2c694",
set: (v)=>
     v === "" 
? "https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/5a/16/f3/46/52/v1_E10/E10C05EQ.jpg?w=1600&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=654914541ae97e998a64b5c78566b9857dc3bbbeabb8415ac91aa84d47c2c694": v,
    },
    price : Number,
    location : String,
    country : String,

    reviews:  [
         {
              type: Schema.Types.ObjectId,
                ref: "Review",
            },

        
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing) {
    await Review.deleteMany({id : {$in: listing.reviews}});
    }
})

const listing = mongoose.model("listings",listingSchema);
module.exports = listing;
