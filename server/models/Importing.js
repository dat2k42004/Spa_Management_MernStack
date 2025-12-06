import mongoose from "mongoose";

const importingSchema = new mongoose.Schema({
     date: {
          type: String,
          required: true,
     },
     totalPrice: {
          type: Number,
          required: true,
     },
     status: {
          type: String,
          enum: ["PAID", "UNPAID"],
          default: "UNPAID",
     },
     userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
     },
     supplierId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Supplier",
     },
     paymentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Payment",
     }
}, { timestamps: true });

const Importing = mongoose.model("Importing", importingSchema);

export default Importing;
