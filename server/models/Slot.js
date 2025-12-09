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
          default: "INACTIVE",
     },
     deviceId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Device",
     },
     isDeleted: {
          type: Boolean,
          default: false,
          required: true,
     }
}, { timestamps: true });

slotSchema.index({ room: 1, location: 1, deviceId: 1});
const Slot = mongoose.model("Slot", slotSchema);

export default Slot;
