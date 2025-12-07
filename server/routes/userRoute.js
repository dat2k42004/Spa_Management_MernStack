import express from "express";
import { register, getAllUsers, deleteUser, searchUser } from "../controllers/userController.js";
import { requiredUser, requiredAdmin } from "../middlewares/auth.js";
const userRouter = express.Router();

// register
userRouter.post("/register", register);

// get all users
userRouter.get("/get-all-users", requiredAdmin, getAllUsers);

// delete user
userRouter.delete("/delete-user/:id", requiredAdmin, deleteUser);

// search user
userRouter.get("/search-user", requiredUser, searchUser);;

export default userRouter;