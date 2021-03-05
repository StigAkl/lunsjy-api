const express = require("express"); 
const cors = require("cors"); 
const path = require("path"); 
const bodyParser = require('body-parser'); 
require('dotenv').config();

const routes = require("./routes/routes"); 
const port = process.env.PORT || 5000; 

require('./mongoose/mongoose'); 

const app = express(); 

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(routes);  

app.listen(port, () => {
    console.log(`Server running on port ${port}`); 
});