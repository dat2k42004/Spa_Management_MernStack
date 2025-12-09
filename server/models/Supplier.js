import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
     },
     email: {
          type: String,
          required: true,
          unique: true,
     },
     tel: {
          type: String,
          required: true,
          unique: true,
     },
     address: {
          type: String,
          required: true,
     },
     paymentInfo: {
          bankName: {
               type: String,
          },
          accountNumber: {
               type: String,
          },
          accountName: {
               type: String,
          }
     },
     isDeleted: {
          type: Boolean,
          default: false,
          required: true,
     }
}, { timestamps: true });


const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;