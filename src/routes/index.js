const express = require("express");
const router = express.Router();

const serviceRoutes = require("./serviceRoutes.js");
const authRoutes = require("./authRoutes.js");
const bookingRoutes = require("./bookingRoutes.js");
const userRouter = require("./userRoutes.js");


router.use("/services" , serviceRoutes );
router.use("/auth" , authRoutes );
router.use("/bookings" , bookingRoutes );
router.use("/users" , userRouter );

module.exports = router;