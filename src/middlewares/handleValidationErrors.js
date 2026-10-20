const { validationResult } = require("express-validator");
const createError = require("../utilities/createError");

const validateRequest = (req, res, next) => {
    const result = validationResult(req);


    if (!result.isEmpty()) {
    const error = createError(
        "Validation failed.",
        400,
        result.mapped()
    );

    console.log("CREATED ERROR:", error);
    console.log("CREATED ERROR ERRORS:", error.errors);

  throw error;
}

    next();
};

module.exports = validateRequest;