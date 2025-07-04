const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./util/expresserror.js");

const listingroutes = require("./routes/listing.js");
const reviewroutes = require("./routes/reviews.js");


const mongo_url = "mongodb://127.0.0.1:27017/Wanderlust";


main().then(() => {
    console.log("connect to db");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(mongo_url);
}

app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);

app.use("/listing", listingroutes);
app.use("/listing", reviewroutes);

app.get("/home", (req, res) => {
    {
        res.render("listings/home.ejs");
    }
});

// error handeling routes 
app.all("*", (req, res, next) => {
    next(new expressError(404, "page not found"));
});
app.use((err, req, res, next) => {
    let { statuscode, message } = err;
    res.render("error.ejs", { statuscode, message });
});
app.listen(3000, () => {
    console.log("browser responded");
});


