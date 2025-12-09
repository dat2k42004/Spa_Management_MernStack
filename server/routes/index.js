import express from "express";
import userRouter from "./userRoute.js";
import authRouter from "./authRoute.js";
import ingredientRouter from "./ingredientRoute.js";
import deviceRouter from "./deviceRoute.js";
import slotRouter from "./slotRoute.js";
const router = express.Router();

// user routes
router.use("/user", userRouter);

// auth routes
router.use("/auth", authRouter);

// ingredient routes
router.use("/ingredient", ingredientRouter);

// device routes
router.use("/device", deviceRouter);

// slot routers
router.use("/slot", slotRouter);
export default router;
