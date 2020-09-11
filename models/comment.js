var mongoose = require("mongoose");

module.exports = mongoose.model("Comment", new mongoose.Schema({
    text:String,
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String 
    }}));