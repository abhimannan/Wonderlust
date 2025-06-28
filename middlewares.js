const Listing = require("./models/listing.js");
let ExpressError = require("./utils/ExpressError.js");
let { listingSchema } = require("./schema.js");
let { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,resp,next)=>{
    if(!req.isAuthenticated()) {
        req.session.redirectURL = req.originalUrl;
        req.flash("error","You must be logged in to create listings!");
        return resp.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,resp,next)=>{
    if(req.session.redirectURL) {
        resp.locals.redirectURL = req.session.redirectURL;
    }
    next();
}

module.exports.isOwner = async(req,resp,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(resp.locals.currUser._id)) {
        req.flash("error","You are not the owner of the listing!");
        return resp.redirect(`/listings/${id}`);
    }
    next();
}

// middleware for schema validation
 module.exports.listingValidation = (req,resp,next)=>{
    let {error} = listingSchema.validate(req.body);
       if(error) {
        let errorMsg = error.details.map((el)=>el.message).join(",");
           throw new ExpressError(400,errorMsg);
       }
       else{
          next();
       }
}

// review validation middleware
module.exports.reviewValidation = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMsg = error.details.map(el => el.message).join(", ");
    return next(new ExpressError(400, errorMsg));
  }
  next();
};

// review author
module.exports.isReviewAuthor = async(req,resp,next) =>{
    let { id, reviewsId } = req.params;
    let review = await Review.findById( reviewsId );
    // console.log(review);
    if(!review.author.equals(resp.locals.currUser._id)) {
        req.flash("error","You are not the author of this review!");
        return resp.redirect(`/listings/${id}`);
    }
    next();
}



