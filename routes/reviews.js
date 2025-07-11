const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../util/wrapasync.js");
const expressError = require("../util/expresserror.js");
const review = require("../models/review.js");
const { reviewjoischema } = require("../schema.js");



const validateReview = (req, res, next)=>{
    let { error } = reviewjoischema.validate(req.body);
    if (error) {
        let errMsg = error.map((el)=>el.message).join(",");
        throw new expressError(400, errMsg);
    }else{
        next();
    }
}

// Post review route
router.post("/:id/reviews",validateReview,
    async(req,res)=>{
        try {
        const listingId = req.params.id;
        console.log(`Searching for listing with ID: ${listingId}`);
        
        const reviewlisting = await listing.findById(listingId);
        
        if (!reviewlisting) {
            console.error(`Listing with ID ${listingId} not found`);
            return res.status(404).send("Listing not found");
        }
        
        let newreview = new review(req.body.review);
        reviewlisting.reviews.push(newreview);
        
        await newreview.save();
        await reviewlisting.save();
        
        res.redirect(`/listing/${listingId}`);
    } catch (error) {
        console.error("Error occurred while posting review:", error);
        res.status(500).send("Internal Server Error");
    }
    // const reviewlisting = await listing.findById(req.params.id);
    // let newreview = new review(req.body.review);
    // await reviewlisting.reviews.push(newreview);

    // await newreview.save();
    // await reviewlisting.save();
    // let{id}= req.params;
    // res.redirect(`/listing/${id}`);
})

//Delete review route
router.delete("/:id/review/:reviewId",wrapAsync( async(req,res)=>{
    let{id,reviewId} = req.params;
    await review.findByIdAndDelete(reviewId);
    await listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    res.redirect(`/listing/${id}`)
})
)


module.exports = router;