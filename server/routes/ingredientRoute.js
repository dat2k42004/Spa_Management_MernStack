import express from "express";
import { requiredAdmin, requiredUser } from "../middlewares/auth.js";
import { addIngredient, updateIngredient, getAllIngredients, searchIngredient } from "../controllers/ingredientController.js";
import upload from "../middlewares/upload.js";
const ingredientRouter = express.Router();

ingredientRouter.post("/add", requiredUser, upload("ingredient").array("images", 10), addIngredient);
ingredientRouter.put("/update/:id", requiredUser, upload("ingredient").array("images", 10), updateIngredient);
ingredientRouter.get("/get-all-ingredients", getAllIngredients);
ingredientRouter.get("/search-ingredient", searchIngredient);


export default ingredientRouter;