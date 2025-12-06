import mongoose from "mongoose";

const defaultIngredientSchema = new mongoose.Schema({
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
          default: 0,
     },
     ingredientId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Ingredient",
     },
     serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Service",
     }
}, { timestamps: true });

const DefaultIngredient = mongoose.model("DefaultIngredient", defaultIngredientSchema);

export default DefaultIngredient;