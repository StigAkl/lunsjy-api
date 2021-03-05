const express = require("express"); 
let Post = require("./../entities/Post"); 
const router = express.Router(); 
const auth = require("./../middleware/auth"); 


router.get("/api/post/:date", auth, async (req, res) => {
    const postDate = req.params.date; 

    try {

        if(postDate === undefined || !isValidDate(postDate)) throw new Error('Missing parameter `date`'); 

        const postDateSplit = req.params.date.split("-"); 
        if(postDateSplit.length !== 3) throw new Error('`Incorrect date format `date`: ' + postDate); 

    } catch(e) {
        return res.status(500).send({
            error: "Parameter 'date' must be provided on the format yyyy-mm-dd" 
        }); 
    }

    const post = await Post.findOne({ postDate, isActive: true });
    if(post) {
        res.send(post); 
    } else {
        res.status(404).send("Could not find any active posts for date " + postDate); 
    }
});

router.put("/api/post", auth, async(req, res) => {
    try {
        const post = await Post.findOneAndUpdate({_id: req.body.id}, {isActive: false});
        
        if(post.error) {
            console.log("Error: " + post.error);
            res.status(500).send({
                error: post.error
            });
        } else {

            if(!post.isActive) {
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

router.post("/api/post", async(req, res) => {

    var numActive = await Post.countDocuments({ isActive: true }); 
    
    if(numActive > process.env.MAX_NUMBER_ACTIVE_POSTS) return res.status(500).send({
        error: "Too many active documents"
    }); 

    const lastPost = await Post.findOne( { isActive: true }).sort( { postDate: -1 } ); 

    const nextPostDate = findNextPostDate(lastPost);  

    if(!isValidDate(nextPostDate)) {
        return res.status(400).send("Error: " + nextPostDate); 
    }

    const existingPost = await Post.findOne({
        postDate: nextPostDate,
    });

    if(existingPost) {
        return res.status(400).send("post already exists"); 
    }

    const post = new Post({
        text: req.body.text,
        created: Date.now(),
        isActive: true,
        postDate: nextPostDate
    });

    try {
        post.save(); 
    } catch(e) {
        res.status(400).send({
            error: "Error while creating post: " + e
        }); 
    }

    res.status(201).send("Post created: " + post); 

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