const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const mongo_url ="mongodb://127.0.0.1:27017/wonderlust";
const listing = require("./models/model.js");

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
const port = 3000;



main().then(()=>{
    console.log("connected to database")
}).catch((err)=>{
    console.log("database not connecrted")
});

async function main(){
    await mongoose.connect(mongo_url);
};

app.get("/listing", async(req,res)=>{
   const alllistings = await listing.find({});
   res.render("index.ejs",{alllistings});
});
app.get("/listing/:id", async(req,res)=>{
    let {id} = req.params;
    const thislisting = await listing.findById(id);  
    res.render("show.ejs",{thislisting});
 });

// app.get("/database",(req,res)=>{
//     const samplelisting = new listing({
//         title:"arindam palace",
//         description: "jhbsdkmprn",
//         image:"",
//         price: 120000,
//         location: "goa",
//         country: "india"
//     });
//     samplelisting.save();
//     res.send(samplelisting);
// });

app.get("/",(req,res)=>{
    res.send("i am root")
});

app.listen(port,()=>{
    console.log("app is listening on port 3000")
});