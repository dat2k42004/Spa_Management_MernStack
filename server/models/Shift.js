import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({
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
     }
}, { timestamps: true });

shiftSchema.index({ date: -1, startTime: 1 });

const Shift = mongoose.model("Shift", shiftSchema);
export default Shift;
