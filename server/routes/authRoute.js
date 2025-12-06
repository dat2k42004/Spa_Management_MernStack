import express from "express";
import { login, refreshAccessToken, getUserInfo, updateProfile, changePassword } from "../controllers/authController.js";
import { requiredUser, requiredAdmin } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
const authRouter = express.Router();


authRouter.post("/login", login);
authRouter.post("/refresh-token", refreshAccessToken);
authRouter.get("/info", requiredUser, getUserInfo);
authRouter.put("/update-profile", requiredUser, upload("avatar").single("image"), updateProfile);
authRouter.put("/change-password", requiredUser, changePassword);

export default authRouter;