import User from "../models/User.js";
import { compare, hash } from "../utils/bcrypt.js";
import { verifyToken } from "../utils/jwt.js";
import { createAccessToken, createRefreshToken } from "../services/userService.js";
import { textNormalize } from "../services/textService.js";
import { deleteFile } from "../services/uploadService.js";
// post: api/auth/login
const login = async (req, res) => {
     try {
          const { account, password } = req.body;

          // check null
          if (!account || !password) {
               return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
               })
          }

          // get user by username/email/tel
          const user = await User.findOne({
               $or: [
                    { username: account },
                    { email: account },
                    { tel: account },
               ]
          });

          // check user exist
          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: "Invalid account",
               })
          }

          // check password
          const checkPassword = await compare(password, user.password);
          if (!checkPassword) {
               return res.status(400).json({
                    success: false,
                    message: "Password incorrect",
               })
          }

          // tokens
          const access = await createAccessToken(user);
          const refresh = await createRefreshToken(user);
          console.log("[login] Access Token: ", access);

          res.status(200).json({
               success: true,
               message: "Login Successfully",
               data: {
                    user: {
                         id: user._id,
                         username: user.username,
                         email: user.email,
                         fullName: user.fullName,
                         tel: user.tel,
                         address: user.address,
                         role: user.role,
                         avatar: user.avatar,
                    },
                    accessToken: access,
                    refreshToken: refresh
               }
          })

     } catch (error) {
          console.log("[login] Error: ", error.message);
          res.status(500).json({
               success: false,
               message: error.message,
          })
     }
};

// post: api/auth/refresh-token
const refreshAccessToken = async (req, res) => {
     try {
          const { refreshToken } = req.body;

          // check null
          if (!refreshToken) {
               return res.status(400).json({
                    success: false,
                    message: "Missing refresh token",
               })
          }

          // verity token
          const decoded = await verifyToken(refreshToken);
          if (!decoded || decoded.type !== "refresh") {
               return res.status(400).json({
                    success: false,
                    message: "Invalid refresh token",
               })
          }

          // get user
          const user = await User.findById(decoded.id);
          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               })
          }

          // generate new access token
          const access = await createAccessToken(user);
          console.log("[refreshAccessToken] New Access Token: ", access);

          res.status(200).json({
               success: true,
               message: "Access token refreshed successfully",
               data: {
                    accessToken: access,
               }
          })
     } catch (error) {
          console.log("[refreshAccessToken] Error: ", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}


// get: api/auth/info
const getUserInfo = async (req, res) => {
     try {
          const userId = req.user.id;

          // get user
          const user = await User.findById(userId);
          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               })
          }

          res.status(200).json({
               success: true,
               message: "User info retrieved successfully",
               data: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    tel: user.tel,
                    address: user.address,
                    role: user.role,
                    avatar: user.avatar,
               }
          })
     } catch (error) {
          console.log("[getUserInfo] Error: ", error.message);
          res.status(500).json({
               success: false,
               message: error.message,
          })

     }
}


// put: api/auth/update-profile
const updateProfile = async (req, res) => {
     try {
          const userId = req.user.id;
          const { fullName, address } = req.body;
          const avatarFile = req.file && req.file.filename ? `uploads/avatar/${req.file.filename}` : null;
          console.log(fullName, address, avatarFile);
          // get user
          const user = await User.findById(userId);
          if (!user) {
               deleteFile(avatarFile);
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               })
          }
          // check null
          if (!fullName && !address && !avatarFile) {
               deleteFile(avatarFile);
               return res.status(400).json({
                    success: false,
                    message: "Nothing to update"
               })
          }

          user.fullName = fullName ? textNormalize(fullName, "name") : user.fullName;
          user.address = address ? textNormalize(address, "address") : user.address;
          if (user.avatar !== "uploads/avatar/default_avatar.png" && avatarFile) {
               deleteFile(user.avatar);
          }
          user.avatar = avatarFile ? avatarFile : user.avatar;

          await user.save();

          res.status(200).json({
               success: true,
               message: "Update profile successfully",
               data: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    tel: user.tel,
                    address: user.address,
                    role: user.role,
                    avatar: user.avatar,
               }
          })
     } catch (error) {
          console.log("[updateProfile] Error: ", error.message);
          res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

// put: api/auth/change-password
const changePassword = async (req, res) => {
     try {
          const userId = req.user.id;
          const { currentPassword, newPassword } = req.body;

          // check null
          if (!currentPassword || !newPassword) {
               return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
               })
          }

          // get user
          const user = await User.findById(userId);
          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               })
          }

          // check current password
          const checkPassword = await compare(currentPassword, user.password);
          if (!checkPassword) {
               return res.status(400).json({
                    success: false,
                    message: "Current password incorrect",
               })
          }

          // check different password
          const checkNewPassword = await compare(newPassword, user.password);
          if (checkNewPassword) {
               return res.status(400).json({
                    success: false,
                    message: "New password must be different from current password",
               })
          }
          const hashPassword = await hash(newPassword);

          // set new password
          user.password = hashPassword;
          await user.save();

          res.status(200).json({
               success: true,
               message: "Change password successfully",
          })
     }
     catch (error) {
          console.log("[changePassword] Error: ", error.message);
          res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

export {
     login,
     refreshAccessToken,
     getUserInfo,
     updateProfile,
     changePassword,
}