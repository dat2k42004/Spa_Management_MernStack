import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
     },
     type: {
          type: String,
          required: true,
     },
     number: {
          type: Number,
          min: 0,
          default: 0,
     },
     description: {
          type: String,
     }
}, { timestamps: true });

const Device = mongoose.model("Device", deviceSchema);

export default Device;

