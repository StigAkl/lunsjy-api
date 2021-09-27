const mongoose = require("mongoose"); 

const JokeSchema = mongoose.Schema({
    text: String, 
    isActive: Boolean, 
    created: { type: Date, default: new Date() }
});

module.exports = mongoose.model("Joke", JokeSchema); 