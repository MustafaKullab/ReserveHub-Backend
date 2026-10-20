const express = require("express");
const tryCatch = require("../middlewares/tryCatch");
const validateRequest = require("../middlewares/handleValidationErrors");
const authUser = require("../middlewares/authUser");
const { createBooking , getBookings , getBooking , cancleBooking , changeStatus} = require("../controllers/bookingController");
const { createBookingValidator , findBookingValidator , updateStatusBookingValidator } = require("../validators/bookingValidators");
const requireRole = require("../middlewares/authRole");
const router = express.Router();

// Router to create a booking 
router.post("/" , authUser ,createBookingValidator , validateRequest, tryCatch(createBooking));


// Router to get bookings of user or all booking of admin 
router.get("/" , authUser , tryCatch(getBookings));

// Router to get specific booking to user or admin 
router.get("/:bookingId" , authUser , findBookingValidator , validateRequest, tryCatch(getBooking));

// Router to canclled the booking 
router.patch("/:bookingId/status" , authUser , findBookingValidator , tryCatch(cancleBooking));
router.patch("/admin/:bookingId/status" , authUser ,requireRole("admin") , findBookingValidator , updateStatusBookingValidator , validateRequest , tryCatch(changeStatus));
module.exports = router;