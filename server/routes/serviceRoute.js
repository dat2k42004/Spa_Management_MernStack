import express from "express";
import { requiredUser, requiredAdmin } from "../middlewares/auth.js";
import { addService, updateService, getAllServices, getServiceFollowDevice } from "../controllers/serviceController.js";


const serviceRouter = express.Router();

// addService
serviceRouter.post("/add", requiredUser, addService);

// updateService
serviceRouter.put("/update/:id", requiredUser, updateService);

// getAllServices
serviceRouter.get("/get-all", getAllServices);

// getServiceFollowDevice
serviceRouter.get("/get-by-device/:deviceId", getServiceFollowDevice);

export default serviceRouter;