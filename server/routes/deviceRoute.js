import express from "express";
import { requiredUser, requiredAdmin } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import { addDevice, updateDevice, getAllDevices, searchDevice, deleteDevice } from "../controllers/deviceController.js";

const deviceRouter = express.Router();

// addDevice
deviceRouter.post("/add", requiredUser, upload("device").array("images", 10), addDevice);

// updateDevice
deviceRouter.put("/update/:id", requiredUser, upload("device").array("images", 10), updateDevice);

// getAllDevices
deviceRouter.get("/get-all", getAllDevices);

// searchDevice
deviceRouter.get("/search", searchDevice);

// deleteDevice
deviceRouter.delete("/delete/:id", requiredUser, deleteDevice);


export default deviceRouter;