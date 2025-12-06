import mongoose from "mongoose";

const usedServiceSchema = new mongoose.Schema({
     startTime: {
          type: String,
          default: "",
     },
     endTime: {
          type: String,
          default: "",
     },
     serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Service",
     },
     slotId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Slot",
     },
     appointmentId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Appointment",
     }
}, { timestamps: true });

const UsedService = mongoose.model("UsedService", usedServiceSchema);

export default UsedService;
