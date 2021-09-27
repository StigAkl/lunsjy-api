const express = require("express"); 
let Joke = require("../entities/Joke"); 
const router = express.Router(); 
const auth = require("../middleware/auth"); 

router.get("/", async (req, res) => {
    res.status(200).send("We are live!"); 
}); 

router.get("/api/post", auth, async (req, res) => {

    const joke = await Joke.findOne({ isActive: true }, {}, {sort: {
        'created': 1
    }});
    if(joke) {
        console.log(joke.text)
        res.send(joke); 
    } else {
        res.status(404).send("Could not find any active posts for date "); 
    }
});

router.get("/api/list", async (req, res) => {
    const jokes = await Joke.find({isActive: true}, {}, {sort: {
        'created': 1
    }});

    res.status(200).send(jokes); 
}); 

router.get("/api/retrtoken", (req, res) => {
    res.status(200).send({
        token: process.env.RETRIEVE_TOKEN
    });
});

router.delete("/api/joke/:id", auth, async (req, res) => {
    const id = req.params.id; 

    try {
        await Joke.deleteOne({
            _id: id
        });

        res.status(204).send({
            "status": "Joke successfully deleted"
        }); 

    } catch(e) {
        res.status(500).send({
            error: "Error when deleting joke" 
        }); 
        console.error("Error deleting joke: " + e); 
    }
})

router.put("/api/post", auth, async(req, res) => {
    try {
        const joke = await Joke.findOneAndUpdate({_id: req.body.id}, {isActive: false});
        if(joke.error) {
            console.log("Error: " + joke.error);
            res.status(500).send({
                error: joke.error
            });
        } else {
            if(!joke.isActive) {
                res.status(200).send({
                    deactivated: req.body.id + " is already deactivated"
                })
            } else {
                res.status(200).send({
                    deactivated: req.body.id
                }); 
            }
        }
    } catch(err) {
        res.status(500).send({
            error: err
        }); 
    }
})

router.post("/api/post", auth, async(req, res) => {

    if(!req.body.text) {
        console.log(req.body.text); 
        return res.status(500).send("Missing joke"); 
    }
    
    var numActive = await Joke.countDocuments({ isActive: true }); 
    
    //Fetch all and calculate edit distance to see if joke alraedy exists
    if(numActive > process.env.MAX_NUMBER_ACTIVE_POSTS) return res.status(500).send({
        error: "Too many active documents"
    }); 

    const joke = new Joke({
        text: req.body.text,
        isActive: true
    });

    try {
        joke.save(); 
    } catch(e) {
        res.status(400).send({
            error: "Error while creating post: " + e
        }); 
    }

    res.status(201).send(joke); 

});

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

// Validates that the input string is a valid date formatted as "yyyy-mm-dd"
function isValidDate(dateString)
{
    // First check for the pattern
    if(!/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(dateString)) {
        return false; 
    }

    // Parse the date parts to integers
    var parts = dateString.split("-");
    var day = parseInt(parts[2], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[0], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12) { 
        return false; 
    }

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};


//yyyy-mm-dd
function findNextPostDate(lastPost) {

    const today = new Date();
    if(lastPost) {
        const dateString = lastPost.postDate; 

        let dateStringSplit = dateString.split("-"); 
        let date = new Date(parseInt(dateStringSplit[0]), parseInt(dateStringSplit[1])-1, parseInt(dateStringSplit[2])); 

        if(date <= today) {
            return new Date(today).setDate(today.getDate()+1); 
        }

        new Date(10, 10, 10, )
        const nextDay = new Date(date); 
        nextDay.setDate(date.getDate()+1); 
        return formatDate(nextDay); 
    } 

    return formatDate(new Date(today).setDate(today.getDate()+1)); 
}


module.exports = router; 