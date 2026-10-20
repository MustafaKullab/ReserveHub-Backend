const STATUS = require("../constants/httpStatus");
const createError = require("../utilities/createError");

const requireRole = (role) => {
    return (req,res , next) => {
        if(req.user.role !== role){
            throw createError("Forbidden." , STATUS.FORBIDDEN);
        }
        next();
    }
}

module.exports = requireRole;