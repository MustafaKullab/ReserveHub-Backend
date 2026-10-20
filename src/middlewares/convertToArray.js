const STATUS = require("../constants/httpStatus");
const createError = require("../utilities/createError");

const convertAvailabilityToArray = (req, res, next) => {
  try {
    if (typeof req.body.availability === "string") {
      req.body.availability = JSON.parse(req.body.availability);
    }
    next();
  } catch (error) {
    next(createError("Invalid availability format.", STATUS.BAD_REQUEST));
  }
};

module.exports = convertAvailabilityToArray;
