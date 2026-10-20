const { body, param } = require("express-validator");

const serviceValidator = [
  body("name").notEmpty().withMessage("Service name is required.").trim(),
  body("description")
    .notEmpty()
    .withMessage("Service description is required.")
    .trim()
    .isLength({ min: 20, max: 150 })
    .withMessage(
      "Please description must be at least 20 character and max 150 charcaters"
    ),
  body("price")
    .exists()
    .withMessage("Service price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0."),
  body("durationMinutes")
    .exists()
    .withMessage("Service duration Minutes is required.")
    .isInt({ min: 20 })
    .withMessage("Duration must be at least 20 minutes."),
  body("isActive")
  .isBoolean()
  .withMessage("isActive must be boolean."),
  body("availability")
    .isArray({ min: 1 })
    .withMessage("Availability must contain at least one schedule."),
  body("availability.*.day")
    .isIn(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
    .withMessage("Invalid availability day."),
  body("availability.*.from")
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage("Invalid from time."),
  body("availability.*.to")
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage("Invalid to time."),
];

const updateServiceValidator = [
  body("name")
  .optional()
  .trim()
  .notEmpty()
  .withMessage("Service name cannot be empty."),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 20, max: 150 })
    .withMessage(
      "Please description must be at least 20 character and max 150 charcaters"
    )
    .notEmpty()
    .withMessage("Service description cannot be empty."),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0."),
  body("durationMinutes")
    .optional()
    .isInt({ min: 20 })
    .withMessage("Duration must be at least 20 minutes."),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be boolean."),
  body("availability")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Availability must contain at least one schedule."),
  body("availability.*.day")
    .optional()
    .isIn(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
    .withMessage("Invalid availability day."),
  body("availability.*.from")
    .optional()
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage("Invalid from time."),
  body("availability.*.to")
    .optional()
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage("Invalid to time."),
];

const serviceIdParamValidator = [
  param("serviceId")
    .isMongoId()
    .withMessage("Invalid service id."),
];

module.exports = {
  serviceValidator,
  updateServiceValidator,
  serviceIdParamValidator,
};
