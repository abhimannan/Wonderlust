let express = require("express");
const router = express.Router();
const User = require("../models/user.js");
let Wrapasync =require("../utils/Wrapasync.js");
let passport = require("passport")
let { saveRedirectUrl } = require("../middlewares.js");

// requiring users controllers
let UsersControllers = require("../controllers/users.js");

// signup routes , add new user
router
    .route("/signup")
    .get(UsersControllers.renderUserSignup)
    .post(Wrapasync(UsersControllers.addNewUser));

// login routes , login authentication
router
    .route("/login")
    .get(UsersControllers.renderLogin)
    .post(
    saveRedirectUrl,
    passport.authenticate('local',
     {
       failureRedirect: '/login',
       failureFlash : true
     }),
    UsersControllers.loginAuthentication);

// logout route
router.get("/logout",UsersControllers.logOut);


module.exports = router;
