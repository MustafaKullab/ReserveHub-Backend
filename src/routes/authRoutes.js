const express = require("express");
const router = express.Router();
const tryCatch = require("../middlewares/tryCatch.js");
const validateRequest = require("../middlewares/handleValidationErrors");
const upload = require("../middlewares/upload.js");


const {
  signupUser,
  verifyAccount,
  forgotPassword,
  resetPassword,
  resendVerification,
  resendResetPassword,
  loginUser,
  refreshAccessToken,
  logout,
} = require("../controllers/authController.js");

const {
  signupValidator,
  verifyValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  resendVerificationValidator,
} = require("../validators/authValidators.js");

// Post to sign up new user
router.post("/signup", upload.single("avatar"), signupValidator, validateRequest,  tryCatch(signupUser));

// Post to verify account
router.post(
  "/verify",
  verifyValidator,
  validateRequest,
  tryCatch(verifyAccount)
);

// post forgot password
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validateRequest,
  tryCatch(forgotPassword)
);

// post to reseet password
router.post(
  "/reset-password",
  resetPasswordValidator,
  validateRequest,
  tryCatch(resetPassword)
);

// post to resend verification code
router.post(
  "/resend-verification",
  resendVerificationValidator,
  validateRequest,
  tryCatch(resendVerification)
);

// post to resend reset pass code
router.post(
  "/resend-reset-password",
  forgotPasswordValidator,
  validateRequest,
  tryCatch(resendResetPassword)
);

// Post to login user
router.post("/login", loginValidator, validateRequest, tryCatch(loginUser));

// post to refresh tokens
router.post("/refresh", tryCatch(refreshAccessToken));

// post to logout user
router.post("/logout", tryCatch(logout));

module.exports = router;
