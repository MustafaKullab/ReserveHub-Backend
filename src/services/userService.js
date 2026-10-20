const STATUS = require("../constants/httpStatus");
const createError = require("../utilities/createError");
const userRepository = require("../repositories/userRepository");
const CreatePagination = require("../utilities/createPagination");

const USER_PUBLIC_FIELDS = "name email role avatar isVerified createdAt updatedAt";

const getUser = async (userId) => {

  const user = await userRepository.findUserById(userId, USER_PUBLIC_FIELDS);

  if (!user) {
    throw createError("User not found.", STATUS.NOT_FOUND);
  }

  return user;
};

const updateUser = async ({ userId, name, avatar }) => {
  const updates = {};

  if (name !== undefined) {
    updates.name = name;
  }

  if (avatar !== undefined && avatar !== null) {
    updates.avatar = avatar;
  }

  if (Object.keys(updates).length === 0) {
    throw createError("No valid fields to update.", STATUS.BAD_REQUEST);
  }

  const user = await userRepository.updateUser(userId, updates , USER_PUBLIC_FIELDS);

  if (!user) {
    throw createError("User not found.", STATUS.NOT_FOUND);
  }

  return user;
};


const getUsers = async ({page , limit}) => {
  const counts = {};

  const totalUsers = await userRepository.totalUsers();

  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  counts.total = totalUsers;
  counts.admins = await userRepository.totalUsers({role: 'admin'});
  counts.users = await userRepository.totalUsers({role: 'user'});
  counts.lastMonth = await userRepository.totalUsers({createdAt: {$gte: startOfMonth}})

  const pagination = CreatePagination({page , limit , totalItems: totalUsers});

  const users = await userRepository.getUsers({skip: pagination.skip , limit: pagination.limit , USER_PUBLIC_FIELDS});
  

  return {pagination , counts ,  users};
}



const updateRole = async ({adminId , userId , role}) => {

  if(adminId.toString() === userId.toString()){
    throw createError("You can not change your own role." , STATUS.FORBIDDEN);
  }

  const user = await userRepository.findUserAndUpdate({userId , role ,USER_PUBLIC_FIELDS});

  if(!user){
    throw createError("User not found." , STATUS.NOT_FOUND);
  }

  return user;
}


const getUserAdmin = async (userId) => {
  const user = await userRepository.findUserById(userId , USER_PUBLIC_FIELDS);

  if(!user){
    throw createError("User not found." , STATUS.NOT_FOUND);
  }

  return user;
}

module.exports = { getUser, updateUser , getUsers , updateRole , getUserAdmin };
