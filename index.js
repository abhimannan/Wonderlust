if(process.env.NODE_ENV != "production") {
 require('dotenv').config();
}
// console.log(process.env.CLOUD_API_SECRETE);

let express = require("express");
let app = express();
let port = 8080;
const mongoose = require('mongoose');
let Listing = require("./models/listing.js"); 
let Review = require("./models/review.js");
let path = require("path");
let methodOverride = require('method-override');
let ejsmate = require('ejs-mate');
let ExpressError = require("./utils/ExpressError.js");
let Wrapasync = require("./utils/Wrapasync.js");
let session = require('express-session');
let flash = require('connect-flash');
let passport = require("passport");
let LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const MongoStore = require('connect-mongo');

// all routes
let listingRouter = require("./routes/listing.js");
let reviewRouter = require("./routes/review.js");
let userRouter = require("./routes/user.js");

let DB_URL = process.env.ATLASDB_URL;

main().then((res)=>{
    console.log("DB Connected");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(DB_URL);
}

// Middlewares
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl : DB_URL,
    crypto : {
        secret : process.env.SECRETE,
    },
    touchAfter : 24 * 36000,
});

store.on("error",()=>{
    console.log("Error In Mongo Session Store" , err);
})

let sessionOptions = {
    store,
  secret: process.env.SECRETE,
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true
  }
};



app.use(session(sessionOptions));
app.use(flash());

// middlewares from the "passport" package - authentication
app.use(passport.initialize());
app.use(passport.session());

// these below lines from the npm passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// middleware for flash messages
app.use((req,resp,next)=>{
    resp.locals.successMeg = req.flash("success");
    resp.locals.errorMeg = req.flash("error");
    resp.locals.currUser = req.user;
    next();
});

/*
app.get("/testListing",async (req,resp)=>{
    let list1 = new Listing({
        title : "Abhi",
        description : "Good!",
        image : "xcfb",
        price : 4500,
        location : "chennai",
        country : "India"
    });
    await list1.save();
    resp.send("data is inseted");
});
*/


/*
app.get("/demouser",async (req,resp)=>{
    let fakeUser = new User({
        email : "abhi543it@gmail.com",
        username : "Abhi"
    });
    let registerUser = await User.register(fakeUser,"1234");
    resp.send(registerUser);
});
*/

// use all the listing routes
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



// if the route is not matched
app.all("*",(req,resp,next)=>{
    next(new ExpressError(404,"Page not found"));
});

// logger
// app.use((req, res, next) => {
//   console.log("REQUEST PATH ", req.path);
//   next();
// });

// Default error handling middlewares
app.use((err,req,resp,next)=>{
    let {status=500,message="something went wrong"} = err;
    resp.render("error.ejs",{err});
});

app.listen(port,(req,resp)=>{
    console.log(`Server is running at port ${port}`);
});                    
