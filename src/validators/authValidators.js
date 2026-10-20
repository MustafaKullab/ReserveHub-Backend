const { body } = require("express-validator");

const signupValidator = [
  body("name").notEmpty().withMessage("User name is required.").trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please Enter a Valid Email.")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
];

const verifyValidator = [
  body("userId")
    .notEmpty()
    .withMessage("User id is required.")
    .isMongoId()
    .withMessage("Invalid user id."),

  body("code")
    .notEmpty()
    .withMessage("Verify code is required.")
    .isLength({ min: 6, max: 6 })
    .withMessage("Verification code must be 6 digits.")
    .isNumeric()
    .withMessage("Verification code must contain numbers only."),
];

const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please Enter a Valid Email.")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
];

const forgotPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),
];

const resetPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),
  body("code")
    .notEmpty()
    .withMessage("Code is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Code must contains 6 characters")
    .isNumeric()
    .withMessage("Code must contain numbers only."),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Pasword must be contains at least 6 characters"),
];


const resendVerificationValidator = [
  body("userId")
    .notEmpty()
    .withMessage("User id is required.")
    .isMongoId()
    .withMessage("Invalid user id."),
];

module.exports = {
  signupValidator,
  verifyValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  resendVerificationValidator
};
