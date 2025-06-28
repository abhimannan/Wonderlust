let User = require("../models/user.js");


module.exports.renderUserSignup = (req,resp)=>{
    resp.render("users/signup.ejs");
}

module.exports.addNewUser = async(req,resp)=>{
    try {
        let {username,email,password} = req.body;
        let newUser = new User({email,username});
        let registerUser = await User.register(newUser,password);
    // console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err) {
            return next(err);
        }
        req.flash("success","Welcome To Wanderlust!");
        resp.redirect("/listings");
    });
    }
    catch(e) {
        req.flash("error",e.message);
        resp.redirect("/signup");
    }
}

module.exports.renderLogin = (req,resp)=>{
    resp.render("users/login.ejs")
}

module.exports.loginAuthentication = async(req,resp)=>{
        req.flash("success","Welocome Back To Wanderlust!");
        let redirectURL = resp.locals.redirectURL || "/listings";
        resp.redirect(redirectURL);
}

module.exports.logOut = (req,resp,next)=>{
    req.logOut((err)=>{
        if(err) {
            return next(err);
        }
        req.flash("success","You are logged out!");
        resp.redirect("/listings");
    });
}



