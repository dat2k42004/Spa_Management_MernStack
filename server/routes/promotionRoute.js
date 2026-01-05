import express from "express";
import { requiredAdmin, requiredUser } from "../middlewares/auth.js";
import { addPromotion, updatePromotion, getAllPromotions, searchPromotion, deletePromotion } from "../controllers/promotionController.js"

const promotionRouter = express.Router();

// addPromotion
promotionRouter.post("/add", requiredUser, addPromotion);

// updatePromotion
promotionRouter.put("/update/:id", requiredUser, updatePromotion);

// getAllPromotions
promotionRouter.get("/get-all", getAllPromotions);

// searchPromotion
promotionRouter.get("/search", searchPromotion);

// deletePromotion
promotionRouter.delete("/delete/:id", requiredUser, deletePromotion);

export default promotionRouter;