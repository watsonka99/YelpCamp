const middleWare = require("../middleware"),
      express = require("express"),
      router = express.Router(),
      Campground = require("../models/campground");

router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if (err) {
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

router.post("/", middleWare.isLoggedIn, function(req, res){
    Campground.create({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username}
    }, function(err, newCamp){
        if(err){
            res.redirect("back")
        } else {
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middleWare.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// show

router.get("/:id", function(req, res){    
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCamp});
        }
    });
});

// edit
router.get("/:id/edit", middleWare.checkCampgroundOwner, function(req, res){
    Campground.findById(req.params.id, function(err, foundCamp){
        res.render("campgrounds/edit", {campground: foundCamp});
    });
});

// update
router.put("/:id", middleWare.checkCampgroundOwner, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err) {
            res.redirect("/campground");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy
router.delete("/:id", middleWare.checkCampgroundOwner, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, foundCamp){
        if (err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;