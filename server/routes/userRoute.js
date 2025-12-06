import express from "express";
import { register, getAllUsers, deleteUser } from "../controllers/userController.js";
import { requiredUser, requiredAdmin } from "../middlewares/auth.js";
const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.get("/get-all-users", requiredAdmin, getAllUsers);
userRouter.delete("/delete-user/:id", requiredAdmin, deleteUser);

export default userRouter;