const { body , param } = require("express-validator");

const createBookingValidator = [
  body("serviceId")
    .notEmpty()
    .withMessage("Service id is required.")
    .isMongoId()
    .withMessage("Service Id is invalid"),
  body("startTime")
    .notEmpty()
    .withMessage("Start time of booking is required.")
    .isISO8601()
    .withMessage("Please Enter a Valid Time."),
];

const findBookingValidator = [
  param("bookingId")
    .isMongoId()
    .withMessage("The id of booking is invalid."),
];

const updateStatusBookingValidator = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Please choose the status of booking.")
    .isIn(["confirmed", "cancelled", "completed"])
    .withMessage("Invalid booking status."),
];

module.exports = { createBookingValidator , findBookingValidator , updateStatusBookingValidator };
