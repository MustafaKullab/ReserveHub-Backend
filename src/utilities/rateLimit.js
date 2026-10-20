const rateLimit = require("express-rate-limit");

const generalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: "Too many requests."
});

const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: "Too many requests."
});

module.exports = {generalRateLimit , authRateLimit};