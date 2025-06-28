let Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
let mapToken = process.env.API_MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.showCallback = async (req,resp)=>{
    let data = await Listing.find({});
    resp.render("index.ejs",{data});
};

module.exports.renderNewForm = (req,resp)=>{                                   
    resp.render("new.ejs");
}

module.exports.addNewData = async(req,resp,next)=>{
    let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,   
    limit: 1,
    })
    .send()
  
    // console.log(response.body.features[0].geometry);
    // resp.send("Done!");

    let url = req.file.path;
    let filename = req.file.filename;
        let Newdata = new Listing(req.body.listing);
        // console.log(req.user);
        Newdata.owner = req.user._id;
        Newdata.image = {url , filename};
        
        Newdata.geometry = response.body.features[0].geometry;

        let savedListing = await Newdata.save();
        console.log(savedListing);
        req.flash("success","New Listing is Created!");
        resp.redirect("/listings");
}


module.exports.showIndividualData = async (req,resp)=>{
    let {id} = req.params;
    let listing =await Listing.findById(id)
        .populate({
            path  : "reviews",
            populate : {
                path : "author",
            }
        })
        .populate("owner");
    if(!listing) {
        req.flash("error","sorry! The Listing Your Requested for doesn't existed!");
        resp.redirect("/listings");
    }
    // console.log(listing.owner);
    resp.render("show.ejs",{listing});
}

module.exports.rendereditListingform = async (req, resp) => {
     let {id} = req.params;
     let listing =await Listing.findById(id);
      if(!listing) {
        req.flash("error","sorry! The Listing Your Requested for doesn't existed!");
        resp.redirect("/listings");
      }  
    let OriginalImageURL = listing.image.url;
    // The below arguments are given by cloudinary cloud : go and search like "cloudinary image transformation" like this seach in the browser
    OriginalImageURL = OriginalImageURL.replace("/upload","/upload/w_250"); 

      resp.render("edit.ejs",{listing , OriginalImageURL});
}

module.exports.editListing = async (req, resp) => {
        let {id} = req.params;
        let editData = await Listing.findByIdAndUpdate(id,{...req.body.listing});
        if(typeof req.file !== "undefined") {
             let url = req.file.path;
             let filename = req.file.filename;
             editData.image = {url , filename};
             await editData.save();
        }
        req.flash("success","Listing is Updated!");
        resp.redirect(`/listings`);
}

module.exports.destroyListings = async (req,resp)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is Deleted!");
    resp.redirect("/listings");
}





