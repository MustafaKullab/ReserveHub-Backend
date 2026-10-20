const sendError = require("../utilities/sendError");

const ErrorHandler = (err, req, res, next) => {
    const status = err.status || 500;    

    console.log(err);
    
    return sendError(res , err.message , status , err.errors || {}); 
    
};

module.exports = ErrorHandler;