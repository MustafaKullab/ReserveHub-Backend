const { body, param } = require("express-validator");

const updateUserValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty."),
];

const updateRoleValidator = [
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required.")
    .isIn(["user", "admin"])
    .withMessage("Role must be user or admin."),
];

const paramsValidator = [
  param("userId").isMongoId().withMessage("Invalid user id."),
];
module.exports = { updateUserValidator, updateRoleValidator, paramsValidator };
