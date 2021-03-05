const mongoose = require('mongoose'); 

const connectionUrl = process.env.MONGODB_URI || ""; 

mongoose.set('useFindAndModify', false); 
mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 
