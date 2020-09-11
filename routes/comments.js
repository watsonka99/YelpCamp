var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
const middleWare = require("../middleware")

router.get("/new", middleWare.isLoggedIn,function(req, res){
    Campground.findById(req.params.id, function(err, foundCamp){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCamp});
        }
    });
});

router.post("/", middleWare.isLoggedIn,function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            }); 
        }
    });
});

// edit
router.get("/:comment_id/edit", middleWare.checkCommentOwner, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        res.render("comments/edit", {campgroundID: req.params.id, comment: foundComment});
    });
});

// update
router.put("/:comment_id", middleWare.checkCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// comment destroy
router.delete("/:comment_id", middleWare.checkCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment){
        if (err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted")
            res.redirect("back");
        }
    });
});

module.exports = router;