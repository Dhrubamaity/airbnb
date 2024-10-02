const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const listingschema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image:{
        type: Object,
        default: "https://cdn.pixabay.com/photo/2023/11/01/11/07/path-8357152_960_720.jpg",
        set: (v) =>
            v === "" ?
                "https://cdn.pixabay.com/photo/2023/11/01/11/07/path-8357152_960_720.jpg" : v,
    },
    price: Number,
    location: String,
    country: String
});
const listing = mongoose.model("listing", listingschema);
module.exports = listing;