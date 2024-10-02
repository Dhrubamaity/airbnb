const mongoose = require("mongoose");
const initData = require("../init/data.js")
const mongo_url ="mongodb://127.0.0.1:27017/wonderlust";
const listing = require("../models/model.js");

main().then(()=>{
    console.log("connected to database")
}).catch((err)=>{
    console.log("database not connecrted")
});

async function main(){
    await mongoose.connect(mongo_url);
}

const initdb = async ()=>{
    await listing.deleteMany({});
    await listing.insertMany(initData.data);
    console.log("data initialized");
};

initdb();
