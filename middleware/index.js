var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all middleware here
const MiddleWare = {

    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        } 
        req.flash("error", "Please login first!");
        res.redirect("/login");
    },
    
    checkCampgroundOwner: function(req, res, next){   
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCamp){
                if (err) {
                    req.flash("error", "Campground not found");
                    res.redirect("back");
                } else {
                    if (foundCamp.author.id.equals(req.user._id)){
                        return next();
                    } else {
                        req.flash("error", "Permission denied");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "Please login first!");
        }
    },

    checkCommentOwner: function(req, res, next){   
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if (err) {
                    req.flash("error", "Comment not found");
                    res.redirect("back");
                } else {
                    if (foundComment.author.id.equals(req.user._id)){
                        return next();
                    } else {
                        req.flash("error", "Permission denied");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "Please login first!");
        }
    }
};

module.exports = MiddleWare;