import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
          unique: true,
          index: true,
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
     },
     images: [{
          type: String,
     }],
     isDeleted: {
          type: Boolean,
          default: false,
          required: true,
     }
}, { timestamps: true });

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

export default Ingredient;