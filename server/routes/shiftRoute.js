import express from "express";
import {requiredAdmin, requiredUser} from "../middlewares/auth.js";
import {addShift} from "../controllers/shiftController.js";

const shiftRouter = express.Router();

// addShift
shiftRouter.post("/add", requiredUser, addShift);


export default shiftRouter;