import express from "express";
import { requiredUser, requiredAdmin } from "../middlewares/auth.js";
import { addSupplier, updateSupplier, getAllSuppliers, searchSupplier, deleteSupplier } from "../controllers/supplierController.js";
import upload from "../middlewares/upload.js";

const supplierRouter = express.Router();

// addSupplier
supplierRouter.post("/add", requiredUser, upload("qr").single("image"), addSupplier);

// updateSupplier
supplierRouter.put("/update/:id", requiredUser, upload("qr").single("image"), updateSupplier);

// getAllSuppliers
supplierRouter.get("/get-all", requiredUser, getAllSuppliers);

// searchSupplier
supplierRouter.get("/search", requiredUser, searchSupplier);

// deleteSupplier
supplierRouter.delete("/delete/:id", requiredUser, deleteSupplier);

export default supplierRouter;