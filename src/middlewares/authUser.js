const jwt = require("jsonwebtoken");
const STATUS = require("../constants/httpStatus");
const createError = require("../utilities/createError");
const userRepository = require("../repositories/userRepository");

const authUser = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    throw createError("No token", STATUS.UNAUTHORIZED);
  }

  let decoded;

  try {
    decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw createError("Invalid or expired token.", STATUS.UNAUTHORIZED);
  }

  const user = await userRepository.findUserById(decoded.id);

  if (!user) {
    throw createError("User not found.", STATUS.UNAUTHORIZED);
  }

  req.user = user;

  next();
};

module.exports = authUser;
