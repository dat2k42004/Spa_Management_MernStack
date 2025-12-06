import mongoose from "mongoose";

const usedIngredientSchema = new mongoose.Schema({
     number: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
     },
     price: {
          type: Number,
          required: true,
          min: 0,
          default: 0
     },
     ingredientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ingredient",
          required: true,
     },
     usedServiceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UsedService",
          required: true,
     }
}, { timestamps: true });

const UsedIngredient = mongoose.model("UsedIngredient", usedIngredientSchema);

export default UsedIngredient;