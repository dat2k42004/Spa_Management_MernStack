import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
     date: {
          type: String,
          required: true,
          default: ""
     },
     totalPrice: {
          type: Number,
          default: 0,
          min: 0,
          required: true,
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
     }
}, { timestamps: true });


const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;