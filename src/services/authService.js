const userRepository = require("../repositories/userRepository.js");
const crypto = require("crypto");
const sendEmail = require("../utilities/sendEmail");
const createError = require("../utilities/createError.js");
const STATUS = require("../constants/httpStatus.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createAccessToken } = require("../utilities/generateTokens.js");

const signupUser = async ({ name, password, email, avatar }) => {
  const existingUser = await userRepository.findUser(email);

  if (existingUser) {
    throw createError("Email is already registered.", STATUS.CONFLICT);
  }

  const verificationCode = crypto.randomInt(100000, 1000000).toString();
  const verificationCodeSentAt = new Date();

  const userDetails = {
    name,
    password,
    email,
    verificationCode,
    verificationCodeSentAt,
    avatar,
  };

  const user = await userRepository.createUser(userDetails);

  await sendEmail({
    to: email,
    subject: `مرحبا ${name}`,
    text: `كود تأكيد الحساب هو : ${verificationCode}`,
  });

  return user;
};

const verifyAccount = async ({ userId, code }) => {
  const user = await userRepository.findUserById(userId);
  const CODE_EXPIRATION_TIME = 10 * 60 * 1000;

  if (!user) {
    throw createError("User not found", STATUS.NOT_FOUND);
  }

  if (!code) {
    throw createError("Please enter the code", STATUS.BAD_REQUEST);
  }

  if (!user.verificationCode || !user.verificationCodeSentAt) {
    throw createError("No active verification code.", STATUS.BAD_REQUEST);
  }

  if (user.verificationCode.toString() !== code.toString()) {
    throw createError("Code is not correct", STATUS.BAD_REQUEST);
  }

  if (
    Date.now() - user.verificationCodeSentAt.getTime() >
    CODE_EXPIRATION_TIME
  ) {
    throw createError("Code is not valid, try again.", STATUS.BAD_REQUEST);
  }

  user.verificationCode = null;
  user.verificationCodeSentAt = null;
  user.isVerified = true;
  await user.save();

  return user;
};

const forgotPassword = async (email) => {
  const user = await userRepository.findUser(email);

  if (!user || !user.isVerified) {
    throw createError()
  }

  const resetPasswordCode = crypto.randomInt(100000, 1000000).toString();

  user.resetPasswordCode = resetPasswordCode;
  user.resetPasswordCodeSentAt = new Date();

  await user.save();

  await sendEmail({
    to: user.email,
    subject: `مرحبا ${user.name}`,
    text: `كود تغيير كلمة المرور هو : ${resetPasswordCode}`,
  });
};

const resetPassword = async ({ email, code, newPassword }) => {
  const user = await userRepository.findUser(email);

  if (!user) {
    throw createError("user not found.", STATUS.NOT_FOUND);
  }

  if (!user.isVerified) {
    throw createError("Your account is not verified", STATUS.BAD_REQUEST);
  }

  if (!user.resetPasswordCode || !user.resetPasswordCodeSentAt) {
    throw createError("No active reset code.", STATUS.BAD_REQUEST);
  }

  if (user.resetPasswordCode.toString() !== code.toString()) {
    throw createError("Code is not correct.", STATUS.BAD_REQUEST);
  }

  if (Date.now() - user.resetPasswordCodeSentAt.getTime() > 10 * 60 * 1000) {
    throw createError("Code is not valid.", STATUS.BAD_REQUEST);
  }

  user.password = newPassword;
  user.passwordChangedAt = new Date();

  user.resetPasswordCode = null;
  user.resetPasswordCodeSentAt = null;

  await user.save();
};

const resendVerification = async (userId) => {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    return;
  }

  if (user.isVerified) {
    throw createError("Your account is already verified.", STATUS.BAD_REQUEST);
  }

  const RESEND_COOLDOWN = 60 * 1000;

  if (
    user.verificationCodeSentAt &&
    Date.now() - user.verificationCodeSentAt.getTime() < RESEND_COOLDOWN
  ) {
    return;
  }

  const newVerificationCode = crypto.randomInt(100000, 1000000).toString();

  user.verificationCode = newVerificationCode;
  user.verificationCodeSentAt = new Date();

  await user.save();

  await sendEmail({
    to: user.email,
    subject: `مرحبا ${user.name}`,
    text: `كود تأكيد حسابك الجديد هو : ${newVerificationCode}`,
  });
};


const resendResetPassword = async (email) => {
  const user = await userRepository.findUser(email);

  if(!user || !user.isVerified){
    return;
  }



  const RESEND_COOLDOWN = 60 * 1000;

  if(user.resetPasswordCodeSentAt && Date.now() - user.resetPasswordCodeSentAt.getTime() < RESEND_COOLDOWN){
    return;
  }


  const newResetPassCode = crypto.randomInt(100000 , 1000000).toString();

  user.resetPasswordCode = newResetPassCode;
  user.resetPasswordCodeSentAt = new Date();

  await user.save();

  await sendEmail({
    to: user.email,
    subject: `مرحبا ${user.name}`,
    text: `كود تأكيد تغيير كلمة مرورك الجديد هو : ${newResetPassCode}`,
  });

}


const loginUser = async ({ email, password }) => {
  const user = await userRepository.findUser(email);

  if (!user) {
    throw createError("Invalid email or password.", STATUS.UNAUTHORIZED);
  }

  const auth = await bcrypt.compare(password, user.password);

  if (!auth) {
    throw createError("Invalid email or password.", STATUS.UNAUTHORIZED);
  }

  if (!user.isVerified) {
    throw createError("Your account is not verified.", STATUS.UNAUTHORIZED);
  }

  return user;
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw createError("Authentication required.", STATUS.UNAUTHORIZED);
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw createError("Invalid or expired refresh token.", STATUS.UNAUTHORIZED);
  }

  const user = await userRepository.findUserById(decoded.id);

  if (!user) {
    throw createError("User not found.", STATUS.UNAUTHORIZED);
  }

  if (!user.isVerified) {
    throw createError("Account is not verified.", STATUS.UNAUTHORIZED);
  }

  const accessToken = createAccessToken(user._id);

  return accessToken;
};

module.exports = {
  signupUser,
  verifyAccount,
  forgotPassword,
  resetPassword,
  resendVerification,
  resendResetPassword,
  loginUser,
  refreshAccessToken,
};
