import mongoose from "mongoose";

const importedIngredientSchema = new mongoose.Schema({
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
     importingId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Importing",
     },
     ingredientId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Ingredient",
     }
}, { timestamps: true });


const ImportedIngredient = mongoose.model("ImportedIngredient", importedIngredientSchema);

export default ImportedIngredient;