const mongoose = require("mongoose");
const Review = require("./review.js");

const listingschema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default:
            "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGhvdXNlfGVufDB8fDB8fHww",
        set: (v) =>
            v === ""
                ? "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGhvdXNlfGVufDB8fDB8fHww"
                : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "review"
        },
    ]
});
listingschema.post('findOneAndDelete', async function(listing) {
    if (listing && listing.reviews && listing.reviews.length > 0) {
        try {
            const result = await Review.deleteMany({ _id: { $in: listing.reviews } });
            console.log(`Deleted ${result.deletedCount} reviews associated with listing ${listing._id}`);
        } catch (err) {
            console.error('Error deleting reviews:', err);
        }
    }
});
const listing = mongoose.model("listing", listingschema);
module.exports = listing;