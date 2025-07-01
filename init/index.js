const mongoose = require("mongoose");
const initdata = require("../init/data.js");
const listing = require("../models/listing.js");
const mongo_url = "mongodb://127.0.0.1:27017/Wanderlust";

main().then(()=>{
    console.log("connect to db");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(mongo_url);
}

const initdb = async()=>{
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    console.log("sample data was initialized");
}

initdb();