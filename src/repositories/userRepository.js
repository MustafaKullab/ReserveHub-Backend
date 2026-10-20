const User = require("../models/user");

const createUser = async (userDetails) => {
  return await User.create(userDetails);
};

const findUser = async (email) => {
  return await User.findOne({ email });
};

const findUserById = async (userId, select = null) => {
  const query = User.findById(userId);

  if (select) {
    query.select(select);
  }

  return query;
};

const updateUser = async (userId, updates, select = null) => {
  const query = User.findByIdAndUpdate({ _id: userId }, updates, {
    new: true,
    runValidators: true,
  });

  if (select) {
    query.select(select);
  }

  return query;
};

const totalUsers = async (filter = {}) => {
  return User.countDocuments(filter);
};

const getUsers = async ({ skip, limit, select = null }) => {
  const query = User.find().skip(skip).limit(limit);

  if (select) {
    query.select(select);
  }

  return query;
};

const findUserAndUpdate = async ({ userId, role, select = null }) => {
  const query = User.findByIdAndUpdate({ _id: userId }, { role } , {new: true , runValidators: true});

  if (select) {
    query.select(select);
  }

  return query;
};


module.exports = {
  createUser,
  findUser,
  findUserById,
  updateUser,
  totalUsers,
  getUsers,
  findUserAndUpdate,
};
