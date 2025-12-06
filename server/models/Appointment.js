import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
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
     date: {
          type: String,
          required: true,
     },
     totalPrice: {
          type: Number,
          min: 0,
          default: 0,
     },
     promotionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Promotion",
     },
     customerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
     },
     staffId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
     }
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
