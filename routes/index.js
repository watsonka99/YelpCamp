var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
    res.render("landing")
});

router.get("/register", function(req, res){
    res.render("register");
  });

router.post("/register", function(req, res){
    User.register(new User({
    username: req.body.username}),
    req.body.password, function(err, user){
    if(err){
        req.flash("error", err.message);
        return res.render("register");
    } 
    passport.authenticate("local")(req, res, function(){
        req.flash("success", "created account" + user.username);
        res.redirect("/campgrounds");
        });
    });
}); 

// Login
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"}), 
    function(req, res){
        res.redirect("/campgrounds")
});

//logout
router.get("/logout", function(req, res){
    req.logOut();
    req.flash("success", "Logged Out")
    res.redirect("/campgrounds");
});

module.exports = router;