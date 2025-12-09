import User from "../models/User.js";
import { hash } from "../utils/bcrypt.js";
import { createAccessToken, createRefreshToken } from "../services/userService.js";
import { textNormalize } from "../services/textService.js";
import { searchFunc } from '../services/searchService.js';

// post: api/user/register
const register = async (req, res) => {
     try {
          const { username, password, email, fullName, tel, address, position } = req.body;
          const role = {
               type: "USER",
               position: position ? position.toUpperCase() : "CUSTOMER",
          }

          // check null
          if (!username || !password || !email || !fullName || !tel || !address) {
               return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
               })
          }

          // check exist username or email or phone
          const existedUser = await User.findOne(
               {
                    $or: [
                         { username: username },
                         { email: email },
                         { tel: tel }
                    ]
               }
          );
          if (existedUser) {
               return res.status(400).json({
                    success: false,
                    message: "Username or email or tel already exist"
               })
          }

          // create user
          const newUser = new User({
               username: username.trim(),
               password: await hash(password),
               email: email.trim(),
               fullName: textNormalize(fullName, "name"),
               tel: tel.trim(),
               address: textNormalize(address, "address"),
               role: role,
               isDeleted: false,
          });

          await newUser.save();

          // tokens
          const access = await createAccessToken(newUser);
          const refresh = await createRefreshToken(newUser);
          console.log("[register] Access Token: ", access);

          res.status(201).json({
               success: true,
               message: "User registered successfully!",
               data: {
                    user: {
                         _id: newUser._id,
                         username: newUser.username,
                         email: newUser.email,
                         fullName: newUser.fullName,
                         tel: newUser.tel,
                         address: newUser.address,
                         role: newUser.role,
                         avatar: newUser.avatar,
                         isDeleted: newUser.isDeleted,
                    },
                    accessToken: access,
                    refreshToken: refresh,
               }
          })
     }
     catch (error) {
          console.log("[register] error: ", error.message);
          res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}


// get: api/user/get-all (requiredAdmin)
const getAllUsers = async (req, res) => {
     try {
          // get page & limit
          const limit = parseInt(req.query.limit) || 10;
          const page = parseInt(req.query.page) || 1;

          const skip = (page - 1) * limit;

          // get user
          const user = await User.findOne({ _id: req.user.id, isDeleted: false });
          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               })
          }
          // get users
          const users = await User.find({ isDeleted: false }).skip(skip).limit(limit).select("-password").sort({ createAt: 1 });

          res.status(200).json({
               success: true,
               message: "Get all users successfully",
               data: {
                    users: users,
               }
          })
     }
     catch (error) {
          console.log("[getAllUsers] Error: ", error.message);
          res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

// delete: api/user/delete/:id (requiredAdmin)
const deleteUser = async (req, res) => {
     try {
          const userId = req.params.id;

          // check user exist
          const user = await User.findOne({ _id: userId, isDeleted: false });
          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               })
          }

          // delete user
          user.isDeleted = true;

          await user.save();

          res.status(200).json({
               success: true,
               message: "User deleted successfully"
          })
     }
     catch (error) {
          console.log("[deleteUser] Error: ", error.message);
          res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

// get: api/user/search (requiredUser)
const searchUser = async (req, res) => {
     try {
          const userId = req.user.id;
          const search = req.query.search || "";
          const limit = parseInt(req.query.limit) || 10;
          const page = parseInt(req.query.page) || 1;
          const skip = (page - 1) * limit;
          // console.log("[searchUser] search: ", search);

          // check user exist
          const user = await User.findOne({ _id: userId, isDeleted: false });
          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               })
          }

          // check permission
          if (user.role.type === "USER" && user.role.position !== "MANAGER" && user.role.position === "RECEPTIONIST") {
               return res.status(400).json({
                    success: false,
                    message: "You do not have permission to perform this action",
               })
          }

          // search user
          const users = await searchFunc(search, User, "fullName", limit, skip, "-password");

          if (users.length === 0) {
               return res.status(200).json({
                    success: true,
                    message: "No user found",
               })
          }

          res.status(200).json({
               success: true,
               message: "Search user successfully",
               data: {
                    users: users,
               }
          })
     }
     catch (error) {
          console.log("[searchUser] Error: ", error.message);
          res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}




export {
     register,
     getAllUsers,
     deleteUser,
     searchUser,
}