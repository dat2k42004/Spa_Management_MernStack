import express from "express";
import userRouter from "./userRoute.js";
import authRouter from "./authRoute.js";
import ingredientRouter from "./ingredientRoute.js";
import deviceRouter from "./deviceRoute.js";
import slotRouter from "./slotRoute.js";
import serviceRouter from "./serviceRoute.js";
import supplierRouter from "./supplierRoute.js";
import shiftRouter from "./shiftRoute.js";
import promotionRouter from "./promotionRoute.js";
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

// service routers
router.use("/service", serviceRouter);

// supplier routers
router.use("/supplier", supplierRouter);

// shift routers
router.use("/shift", shiftRouter);

// promotion routers
router.use("/promotion", promotionRouter);

export default router;
