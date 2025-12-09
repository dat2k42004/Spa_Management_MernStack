import express from "express";
import { login, refreshAccessToken, getUserInfo, updateProfile, changePassword } from "../controllers/authController.js";
import { requiredUser, requiredAdmin } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
const authRouter = express.Router();

// login
authRouter.post("/login", login);

// refresh token
authRouter.post("/refresh-token", requiredUser, refreshAccessToken);

// get user info
authRouter.get("/info", requiredUser, getUserInfo);

// update profile
authRouter.put("/update-profile", requiredUser, upload("avatar").single("image"), updateProfile);

// change password
authRouter.put("/change-password", requiredUser, changePassword);

export default authRouter;