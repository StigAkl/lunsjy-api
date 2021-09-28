const express = require("express"); 
const cors = require("cors"); 
const bodyParser = require('body-parser'); 
const morgan = require('morgan')

require('dotenv').config();

const app = express(); 
const router = require("./routes/routes"); 
const port = process.env.PORT || 5000; 

require('./mongoose/mongoose'); 

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(morgan('combined'));
app.use(cors());

//Routing
app.use(router);  

console.warn("This is a warning!"); 

app.listen(port, () => {
    console.log(`Server running on port ${port}`); 
});