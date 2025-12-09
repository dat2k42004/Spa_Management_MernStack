import express from "express";
import { requiredAdmin, requiredUser } from "../middlewares/auth.js";
import { addSlot, updateSlot, getAllSlots, getSlotFollowDevice, deleteSlot, getAvailableSlotFollowService } from "../controllers/slotController.js";
import { get } from "mongoose";

const slotRouter = express.Router();

// addSlot
slotRouter.post("/add", requiredUser, addSlot);

// updateSlot
slotRouter.put("/update/:id", requiredUser, updateSlot);

// getAllSlots
slotRouter.get("/get-all", requiredUser, getAllSlots);

// getSlotFollowDevice
slotRouter.get("/get-follow-device/:deviceId", requiredUser, getSlotFollowDevice);

// deleteSlot
slotRouter.delete("/delete/:id", requiredUser, deleteSlot);

// getAvailableSlotFollowDevice
slotRouter.get("/get-available-slot-follow-device/:deviceId", requiredUser, getAvailableSlotFollowService);

export default slotRouter;

