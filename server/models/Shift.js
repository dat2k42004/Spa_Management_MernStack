import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({
     type: {
          type: String,
          required: true,
          enum: ["MORNING", "AFTERNOON"],
          default: "MORNING"
     },
     date: {
          type: String,
          required: true,
     },
     startTime: {
          type: String,
          required: true,
     },
     endTime: {
          type: String,
          required: true,
     },
     isDeleted: {
          type: Boolean,
          default: false,
          required: true,
     }
}, { timestamps: true });

shiftSchema.index({ date: -1, startTime: 1 });

const Shift = mongoose.model("Shift", shiftSchema);
export default Shift;
