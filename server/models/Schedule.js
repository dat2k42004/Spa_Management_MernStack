import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
     checkIn: {
          type: String,
          default: "",
     },
     checkOut: {
          type: String,
          default: "",
     },
     isCheckedIn: {
          type: Boolean,
          default: false,
     },
     shiftId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Shift",
          required: true
     },
     userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
     }
}, { timestamps: true });

scheduleSchema.index({ checkIn: 1 });

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
