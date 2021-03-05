const mongoose = require("mongoose"); 

const PostSchema = mongoose.Schema({
    text: String, 
    isActive: Boolean,  
    postDate: String,
    created: Date,
});

module.exports = mongoose.model("Post", PostSchema); 