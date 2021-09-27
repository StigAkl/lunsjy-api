const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000, // 10 seconds
    max: 2 // limit each IP to 100 requests per windowMs
  });



module.exports = limiter; 