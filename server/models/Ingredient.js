import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
          unique: true,
     },
     unit: {
          type: String,
          required: true,
     },
     number: {
          type: Number,
          min: 0,
          default: 0,
          required: true,
     },
     description: {
          type: String,
     }
}, { timestamps: true });

ingredientSchema.index({ name: 1 }, { unique: true });
const Ingredient = mongoose.model("Ingredient", ingredientSchema);

export default Ingredient;