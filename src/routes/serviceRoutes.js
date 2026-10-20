const express = require("express");
const router = express.Router();
const tryCatch = require("../middlewares/tryCatch.js");
const requireRole = require("../middlewares/authRole.js");
const authUser = require("../middlewares/authUser.js");
const validateRequest = require("../middlewares/handleValidationErrors");

const {serviceValidator , updateServiceValidator , serviceIdParamValidator} = require("../validators/serviceValidators.js");
const {getServices , getService , createService , updateService , disabledService} = require("../controllers/serviceController.js");
const upload = require("../middlewares/upload.js");
const convertAvailabilityToArray = require("../middlewares/convertToArray.js");
const validateServiceAvailability = require("../middlewares/validateServiceAvailability.js");


// Router to get All services 
router.get("/" , tryCatch(getServices));

// Router to get sprcific service
router.get("/:serviceId" , serviceIdParamValidator , validateRequest ,tryCatch(getService));

// Router to create a new service 
router.post("/" , authUser , requireRole("admin"), upload.single("image"), convertAvailabilityToArray , serviceValidator, validateRequest,validateServiceAvailability, tryCatch(createService));

// patch to update service 
router.patch("/:serviceId" , authUser, requireRole("admin"), upload.single("image"), convertAvailabilityToArray, serviceIdParamValidator , updateServiceValidator ,validateRequest,  validateServiceAvailability, tryCatch(updateService));


// delete to disabled the service 
router.delete("/:serviceId" , authUser , requireRole("admin") , serviceIdParamValidator , validateRequest , tryCatch(disabledService));

module.exports = router;