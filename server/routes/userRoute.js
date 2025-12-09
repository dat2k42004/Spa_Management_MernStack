import express from "express";
import { register, getAllUsers, deleteUser, searchUser } from "../controllers/userController.js";
import { requiredUser, requiredAdmin } from "../middlewares/auth.js";
const userRouter = express.Router();

// register
userRouter.post("/register", register);

// get all users
userRouter.get("/get-all", requiredAdmin, getAllUsers);

// delete user
userRouter.delete("/delete/:id", requiredAdmin, deleteUser);

// search user
userRouter.get("/search", requiredUser, searchUser);;

export default userRouter;