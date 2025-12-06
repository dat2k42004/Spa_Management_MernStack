import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
     date: {
          type: String,
          required: true,
          default: "",
     },
     cost: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
     },
     appointmentId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Appointment",
     },
     form: {
          type: {
               type: String,
               enum: ["CASH", "CARD", "BANK"],
               default: "CASH",
          },
          image: {
               type: String,
               default: "",
          }
     },
     idPaid: {
          type: Boolean,
          default: false,
     }
}, { timestamps: true });


const Bill = mongoose.model("Bill", billSchema);

export default Bill;
