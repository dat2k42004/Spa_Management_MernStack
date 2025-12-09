import express from "express";
import { requiredAdmin, requiredUser } from "../middlewares/auth.js";
import { addIngredient, updateIngredient, getAllIngredients, searchIngredient, deleteIngredient } from "../controllers/ingredientController.js";
import upload from "../middlewares/upload.js";
const ingredientRouter = express.Router();

// add ingredient
ingredientRouter.post("/add", requiredUser, upload("ingredient").array("images", 10), addIngredient);

//update ingredient
ingredientRouter.put("/update/:id", requiredUser, upload("ingredient").array("images", 10), updateIngredient);

// get all ingredients
ingredientRouter.get("/get-all", getAllIngredients);

// search ingredient
ingredientRouter.get("/search", searchIngredient);

// delete ingredient
ingredientRouter.delete("/delete/:id", requiredUser, deleteIngredient);



export default ingredientRouter;