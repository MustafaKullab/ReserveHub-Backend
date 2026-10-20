const express = require("express");
const router = express.Router();
const authUser = require("../middlewares/authUser");
const tryCatch = require("../middlewares/tryCatch");
const upload = require("../middlewares/upload.js");
const requireRole = require("../middlewares/authRole.js");

const { getUser , updateUser , getUsers, updateRole , getUserAdmin } = require("../controllers/userController.js");
const { updateUserValidator, updateRoleValidator, paramsValidator } = require("../validators/userValidators.js");
const validateRequest = require("../middlewares/handleValidationErrors.js");

// Router to get user 
router.get("/me" , authUser , tryCatch(getUser));

// Router to update user 
router.patch("/me" , authUser , upload.single("avatar") , updateUserValidator , validateRequest, tryCatch(updateUser));

// Router to get all users for admin 
router.get("/" , authUser , requireRole("admin") , tryCatch(getUsers));

// Router to get Specific user for admin 
router.get("/:userId" , authUser , requireRole("admin") , paramsValidator, validateRequest,  tryCatch(getUserAdmin));

// Router to update the role of user by admin 
router.patch("/:userId/role" , authUser ,paramsValidator, updateRoleValidator , validateRequest ,  requireRole("admin") , tryCatch(updateRole));

module.exports = router;
