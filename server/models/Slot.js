import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
     room: {
          type: String,
          required: true,
     },
     location: {
          type: String,
          required: true,
     },
     status: {
          type: String,
          enum: ["ACTIVE", "INACTIVE"],
          default: "ACTIVE",
     },
     deviceId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Device",
     }
}, { timestamps: true });

const Slot = mongoose.model("Slot", slotSchema);

export default Slot;
