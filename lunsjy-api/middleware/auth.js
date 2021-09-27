const auth = async(req, res, next) => {
    try {
        const token = req.header("Authorization"); 

        console.log(token); 
        if(!token || token !== process.env.RETRIEVE_TOKEN) {
            throw new Error("Not authorized"); 
        }

        next(); 

    } catch(e) {
        res.status(401).send({
            error: "Unathorized."
        }); 
    }
}

module.exports = auth; 