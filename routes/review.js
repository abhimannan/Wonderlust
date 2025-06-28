let express = require("express");
const router = express.Router({mergeParams : true});
let Wrapasync = require("../utils/Wrapasync.js");
let Listing = require("../models/listing.js");
let Review = require("../models/review.js");
let {reviewSchema} = require("../schema.js");
let { reviewValidation, isLoggedIn,isReviewAuthor } = require("../middlewares.js");

// requiring review callbacks
let ReviewController = require("../controllers/reviews.js");

// all the reviews route
// add review route
router.post("/",
    isLoggedIn,
    reviewValidation,
    Wrapasync(ReviewController.addNewReview));

// delete review
router.delete("/:reviewsId",
    isLoggedIn,
    isReviewAuthor,
    Wrapasync(ReviewController.deleteReview));

module.exports = router;
