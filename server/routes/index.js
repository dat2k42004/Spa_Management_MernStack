import express from "express";
import userRouter from "./userRoute.js";
import authRouter from "./authRoute.js";
import ingredientRouter from "./ingredientRoute.js";
const router = express.Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/ingredient", ingredientRouter);

export default router;
