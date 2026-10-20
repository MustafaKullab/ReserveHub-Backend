const STATUS = require("../constants/httpStatus");
const userService = require("../services/userService");

const getUser = async (req,res) => {
    const userId = req.user._id;

    const user = await userService.getUser(userId);

    return res.status(STATUS.OK).json({success: true , user});
}


const updateUser = async (req,res) => {
    const userId = req.user._id;
    const { name } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;

    const user  = await userService.updateUser({userId , name , avatar});

    return res.status(STATUS.OK).json({success: true , user });
}


const getUsers = async (req,res) => {
    const {page , limit} = req.query;

    const {pagination , counts , users} = await userService.getUsers({page , limit});

    return res.status(STATUS.OK).json({success: true , pagination , counts , users });
}


const updateRole = async (req,res) => {
    const adminId = req.user._id;
    const {userId} = req.params;
    const {role} = req.body;

    const userUpdated = await userService.updateRole({adminId , userId , role});

    return res.status(STATUS.OK).json({success: true , userUpdated});

}


const getUserAdmin = async (req,res) => {
    const {userId} = req.params;

    const user = await userService.getUserAdmin(userId);

     return res.status(STATUS.OK).json({
    success: true,
    user,
  });
}

module.exports = { getUser , updateUser , getUsers , updateRole , getUserAdmin };