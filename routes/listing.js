let express = require("express");
const router = express.Router();
let Wrapasync = require("../utils/Wrapasync.js");
let Listing = require("../models/listing.js");
let Review = require("../models/review.js");
let ExpressError = require("../utils/ExpressError.js");
let {listingSchema} = require("../schema.js");
let { isLoggedIn,isOwner,listingValidation } = require("../middlewares.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage });


// requiring controllers
let ListingControllers = require("../controllers/listings.js");
// const { storage } = require("../cloudconfig.js");

// listing routes
// show route (or) index route , // add new data route
router
    .route("/")
    .get(Wrapasync(ListingControllers.showCallback))
    .post(
    isLoggedIn,
    upload.single('listing[image]') ,
    listingValidation,
    Wrapasync(ListingControllers.addNewData));
// new route
router.get("/new",
    isLoggedIn,
    ListingControllers.renderNewForm
    );

// show individual data , update route , destroy route
 router
    .route("/:id")
    .get(Wrapasync(ListingControllers.showIndividualData))
    .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]') ,
    listingValidation,
    Wrapasync(ListingControllers.editListing))
    .delete(
    isLoggedIn,
    isOwner,
    Wrapasync(ListingControllers.destroyListings));

    
// eidt form
router.get("/:id/edit",
     isLoggedIn,
     isOwner,
     Wrapasync(ListingControllers.rendereditListingform));


module.exports = router;
