let Review = require("../models/review.js");
let Listing = require("../models/listing.js");


module.exports.addNewReview = async(req,resp)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review is Created!");
    resp.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async(req,resp)=>{
    let {id,reviewsId} = req.params;
    // console.log(id);
    // console.log(reviewsId);
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewsId}});
    let d = await Review.findByIdAndDelete(reviewsId);
    req.flash("success","Review is Deleted!");
    resp.redirect(`/listings/${id}`);
}




