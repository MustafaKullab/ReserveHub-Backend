const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const {generalRateLimit} = require("./utilities/rateLimit.js");
const cookieParser = require("cookie-parser");
const router = require("./routes");
const ErrorHandler = require("./middlewares/ErrorHandler.js");

const app = express();

// Helmet to protect the server from difference attacks 
app.use(helmet({contentSecurityPolicy: true ,crossOriginResourcePolicy: false}));

// Cors to allow the front end to access to the backend server 
const allowedOrigins = ["http://localhost:5173"];

app.use(cors({
    origin: (origin , callback) => {
        if(!origin || allowedOrigins.includes(origin)){
            callback(null , true);
        } else {
            callback(new Error("Not allowed to access"))
        }
    },
    credentials: true,
}));


// Rate Limit to increase security of app 
app.use(generalRateLimit);

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());


app.use("/api/v1",router);


// General Error Handular 
app.use(ErrorHandler);

module.exports = app;