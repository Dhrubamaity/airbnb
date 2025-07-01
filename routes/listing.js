const express = require("express");
const app = express()
const path = require("path")
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../util/wrapasync.js");
const expressError = require("../util/expresserror.js");
const { listingSchema } = require("../schema.js");



const validatelisting = (req, res, next)=>{
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.map((el)=>el.message).join(",");
        throw new expressError(400, errMsg);
    }else{
        next();
    }
}


app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

//home page


//index route
router.get("/", wrapAsync(async (req, res) => {
    const alllistings = await listing.find({});
    console.log("index")
    res.render("listings/index.ejs", { alllistings });
}));

//new route
router.get("/new", (req, res) => {
    console.log("new");
    res.render("listings/new.ejs");
});

//create route
router.post("/new",
    validatelisting,
    wrapAsync(async (req, res, next) => {
    let newlisting = new listing(req.body.newlisting);
    await newlisting.save();
    res.redirect("/listing");
}));

// edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const newlisting = await listing.findById(id);
    res.render("./listings/edit.ejs", { newlisting });
}));

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { Listing });
}));

//update route
router.put("/:id", 
    validatelisting, 
    wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.newlisting });
    res.redirect("/listing");
}));

//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

module.exports = router;
