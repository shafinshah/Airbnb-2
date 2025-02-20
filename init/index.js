const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
    
}

const initDB = async () =>{
    await listing.deleteMany({});
    initdata.data  = initdata.data.map((obj)=>({
        ...obj,
        owner: "67b17680fea5df1153551885",
    }));
    await listing.insertMany(initdata.data);
    console.log("data was initialize");

}
initDB();