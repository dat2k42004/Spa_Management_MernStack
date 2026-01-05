import Ingredient from "../models/Ingredient.js";
import User from "../models/User.js";
import { textNormalize } from "../services/textService.js";
import { deleteFiles } from "../services/uploadService.js";
import { searchFunc } from "../services/searchService.js";


// post: api/ingredient/add (requiredUser)
const addIngredient = async (req, res) => {
     const images = req.files ? req.files.map(file => `uploads/ingredient/${file.filename}`) : [];
     try {
          const id = req.user.id;
          const { name, unit, number, description } = req.body;
          
          // check user exist
          const user = await User.findOne({ _id: id, isDeleted: false });
          if (!user) {
               deleteFiles(images);
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               })
          }

          // check permission
          if (user.role.type === "USER" && user.role.position !== "WAREHOUSE" && user.role.position !== "MANAGER") {
               deleteFiles(images);
               return res.status(400).json({
                    success: false,
                    message: "You do not have permission to add ingredient",
               })
          }

          // check null fields
          if (!name || !unit || images.length === 0) {
               deleteFiles(images);
               return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
               })
          }

          // check ingredient exist
          const existedIngredient = await Ingredient.findOne({ name: name });
          if (existedIngredient) {
               deleteFiles(images);
               return res.status(400).json({
                    success: false,
                    message: "Ingredient already existed",
               })
          }

          // create new ingredient
          const newIngredient = new Ingredient({
               name: textNormalize(name, "name"),
               unit: textNormalize(unit, "unit"),
               number: number ? Number(number) : 0,
               description: description ? textNormalize(description, "des") : "",
               images: images
          });

          await newIngredient.save();

          res.status(200).json({
               success: true,
               message: "Add ingredient successfully",
               data: {
                    ingredient: newIngredient
               }
          })

     }
     catch (error) {
          deleteFiles(images);
          console.log("[addIngredient] Error: ", error);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

// put: api/ingredient/update/:id (requiredUser)
const updateIngredient = async (req, res) => {
     const images = req.files ? req.files.map(file => `uploads/ingredient/${file.filename}`) : [];
     try {
          const userId = req.user.id;
          let { unit, number, description, currentImage } = req.body;
          currentImage = typeof currentImage === "string" ? JSON.parse(currentImage) : currentImage;
          const ingredientId = req.params.id;
          

          // check user exist
          const user = await User.findOne({ _id: userId, isDeleted: false });
          if (!user) {
               deleteFiles(images);
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               })
          }

          // check permission
          if (user.role.type === "USER" && user.role.position !== "WAREHOUSE" && user.role.position !== "MANAGER") {
               deleteFiles(images);
               return res.status(400).json({
                    success: false,
                    message: "You do not have permission to update ingredient",
               })
          }

          // check null fields
          // console.log("[updateIngredient] Current Image: ", currentImage);
          if (!unit || !number || !description || (currentImage.length === 0 && images.length === 0)) {
               deleteFiles(images);
               return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
               })
          }

          // check ingredient exist
          console.log("[updateIngredient] Ingredient id: ", ingredientId);
          const ingredient = await Ingredient.findOne({
               _id: ingredientId,
               isDeleted: false
          })
          if (!ingredient) {
               deleteFiles(images);
               return res.status(400).json({
                    success: false,
                    message: "Ingredient not found",
               })
          }

          // check new info
          unit = textNormalize(unit, "unit");
          description = description ? textNormalize(description, "des") : "";
          const removeFile = (ingredient.images.length !== 0) ? ingredient.images.filter(img => !currentImage.includes(img)) : [];
          if (ingredient.unit === unit && ingredient.number === Number(number) && ingredient.description === description && removeFile.length === 0 && images.length === 0) {
               deleteFiles(images);
               return res.status(400).json({
                    success: false,
                    message: "Nothing to update",
               })
          }

          // delete removed files
          console.log("[updateIngredient] Remove file: ", removeFile);
          if (removeFile.length !== 0) {
               deleteFiles(removeFile);
          }

          // update ingredient
          ingredient.unit = unit;
          ingredient.number = Number(number);
          ingredient.description = description;
          ingredient.images = [...currentImage, ...images];

          await ingredient.save();

          res.status(200).json({
               success: true,
               message: 'Update ingredient successfully',
               data: {
                    ingredient: ingredient
               }
          })

     }
     catch (error) {
          deleteFiles(images);
          console.log("[updateIngredient] Error: ", error);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

// get: api/ingredient/get-all
const getAllIngredients = async (req, res) => {
     try {
          // get query params
          const limit = parseInt(req.query.limit) || 10;
          const page = parseInt(req.query.page) || 1;
          const skip = (page - 1) * limit;
          // get ingredients
          const ingredients = await Ingredient.find({ isDeleted: false }).limit(limit).skip(skip).sort({ createdAt: -1 });

          res.status(200).json({
               success: true,
               message: "Get all ingredients successfully",
               data: {
                    ingredients: ingredients,
               }
          })
     }
     catch (error) {
          console.log("[getAllIngredients] Error: ", error);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

// get: api/ingredient/search
const searchIngredient = async (req, res) => {
     try {
          // get params
          const search = req.query.search || "";
          const limit = parseInt(req.query.limit) || 10;
          const page = parseInt(req.query.page) || 1;
          const skip = (page - 1) * limit;

          // search ingredients
          const ingredients = await searchFunc(search, Ingredient, "name", limit, skip);

          if (ingredients.length === 0) {
               return res.status(200).json({
                    success: true,
                    message: "No ingredient found",
               })
          }

          res.status(200).json({
               success: true,
               message: "Search ingredient successfully",
               data: {
                    ingredients: ingredients,
               }
          })

     }
     catch (error) {
          console.log("[searchIngredient] Error: ", error);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

// delete: api/ingredient/delete/:id (requiredUser)
const deleteIngredient = async (req, res) => {
     try {
          const userId = req.user.id;
          const ingredientId = req.params.id;

          // check user exist
          const user = await User.findOne({ _id: userId, isDeleted: false });
          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               })
          }

          // check permission
          if (user.role.type === "USER" && user.role.position !== "WAREHOUSE" && user.role.position !== "MANAGER") {
               return res.status(400).json({
                    success: false,
                    message: "You do not have permission to delete ingredient",
               })
          }

          // check ingredient exist
          const ingredient = await Ingredient.findOne({ _id: ingredientId, isDeleted: false });

          if (!ingredient) {
               return res.status(400).json({
                    success: false,
                    message: "Ingredient not found",
               })
          }

          // delete ingredient
          ingredient.isDeleted = true;
          await ingredient.save();

          res.status(200).json({
               success: true,
               message: "Delete ingredient successfully",
          })
     }
     catch (error) {
          console.log("[deleteIngredient] Error: ", error.message);
          return res.status(500).json(
               {
                    success: false,
                    message: error.message,
               }
          )
     }
}


export {
     addIngredient,
     updateIngredient,
     getAllIngredients,
     searchIngredient,
     deleteIngredient,
}