const mongoose = require('mongoose'); 

const connectionUrl = process.env.MONGODB_URI;

console.log("######URL#######" + connectionUrl); 

mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 
