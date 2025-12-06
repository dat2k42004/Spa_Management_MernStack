import User from "../models/User.js";
import { hash } from "../utils/bcrypt.js";
import { createAccessToken, createRefreshToken } from "../services/userService.js";

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
               username: username,
               password: await hash(password),
               email: email,
               fullName: fullName,
               tel: tel,
               address: address,
               role: role,
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
                         id: newUser._id,
                         username: newUser.username,
                         email: newUser.email,
                         fullName: newUser.fullName,
                         tel: newUser.tel,
                         address: newUser.address,
                         role: newUser.role,
                         avatar: newUser.avatar,
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


// get: api/user/get-all-users
const getAllUsers = async (req, res) => {
     try {
          // get page & limit
          const limit = parseInt(req.query.limit) || 10;
          const page = parseInt(req.query.page) || 1;

          const skip = (page - 1) * limit;
          // get users
          const users = await User.find().skip(skip).limit(limit).select("-password").sort({ createAt: 1 });

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

// delete: api/user/delete-user/:id
const deleteUser = async (req, res) => {
     try {
          const userId = req.params.id;

          // check user exist
          const user = await User.findById(userId);
          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               })
          }

          // delete user
          await User.findByIdAndDelete(userId);

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




export {
     register,
     getAllUsers,
     deleteUser,
}