import mongoose from "mongoose";

const promotionSchema = mongoose.Schema({
     name: {
          type: String,
          required: true,
          unique: true,
     },
     startTime: {
          type: String,
          required: true,
     },
     endTime: {
          type: String,
          required: true,
     },
     percent: {
          type: Number,
          min: 0,
          required: true,
     },
     quantity: {
          type: Number,
          min: 0,
          required: true,
     },
     limitPrice: {
          type: Number,
          default: 0,
          min: 0,
     }
}, { timestamps: true });

const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;

