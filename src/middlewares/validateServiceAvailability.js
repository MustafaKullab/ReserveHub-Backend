const STATUS = require("../constants/httpStatus");
const createError = require("../utilities/createError");

const validateServiceAvailability = (req, res, next) => {
  const availability = req.body.availability;

  if (!Array.isArray(availability)) {
    return next();
  }

  for(const slot of availability){
    if (slot.from >= slot.to) {
     return next(createError("Conflect between slots.", STATUS.BAD_REQUEST));
    }
  };

  for (let i = 0; i < availability.length; i++) {
    for (let j = i + 1; j < availability.length; j++) {
      const A = availability[i];
      const B = availability[j];

      if (A.day === B.day) {
        if (!(A.from >= B.to || B.from >= A.to)) {
         return next(createError("Conflect between slots.", STATUS.BAD_REQUEST));
        }
      }
    }
  }

  next();
};


module.exports = validateServiceAvailability;