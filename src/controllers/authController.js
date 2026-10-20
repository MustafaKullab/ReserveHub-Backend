const STATUS = require("../constants/httpStatus.js");
const authService = require("../services/authService.js");
const {
  createAccessToken,
  createRefreshToken,
} = require("../utilities/generateTokens.js");
const {
  setAuthCookies,
  clearAuthCookies,
} = require("../utilities/handleAuthTokens.js");

const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  

  const avatar = req.file ? `uploads/${req.file.filename}` : null;

  const user = await authService.signupUser({ name, email, password, avatar });

  return res.status(STATUS.CREATED).json({ success: true, userId: user._id });
};

const verifyAccount = async (req, res) => {
  const { userId, code } = req.body;

  console.log(userId , code);
  

  const user = await authService.verifyAccount({ userId, code });

  // create tokens and send it to the cookie
  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);

  setAuthCookies(res, accessToken, refreshToken);

  return res.status(STATUS.OK).json({ success: true });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  console.log(email);
  

  await authService.forgotPassword(email);

  return res
    .status(STATUS.OK)
    .json({
      success: true,
      message:
        "If an account exists for this email, a reset code has been sent.",
    });
};

const resetPassword = async (req , res) => {
  const {email , code , newPassword} = req.body;

  await authService.resetPassword({email , code , newPassword});

  return res.status(STATUS.OK).json({
    success: true,
    message: "Password has been reset successfully."
  });
}


const resendVerification = async (req,res) => {
  const {userId} = req.body;
  
  await authService.resendVerification(userId);

  return res.status(STATUS.OK).json({
    success: true,
    message: "If verification is required, a new code has been sent.",
  });
}

const resendResetPassword = async (req,res) => {
  const {email} = req.body;

  await authService.resendResetPassword(email);

  return res.status(STATUS.OK).json({success: true})
}


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.loginUser({ email, password });

  // create tokens and send it to the cookie
  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);

  setAuthCookies(res, accessToken, refreshToken);

  return res.status(STATUS.OK).json({ success: true });
};

const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  const accessToken = await authService.refreshAccessToken(refreshToken);

  setAuthCookies(res, accessToken);

  return res.status(STATUS.OK).json({ success: true });
};

const logout = async (req, res) => {
  clearAuthCookies(res);

  return res.status(STATUS.OK).json({ success: true });
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
  logout,
};
