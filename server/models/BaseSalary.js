import mongoose from "mongoose";

const baseSalarySchema = new mongoose.Schema({
     coefficient: {
          type: Number,
          min: 0,
          default: 0,
     },
     salary: {
          type: Number,
          min: 0,
          default: 0,
     },
     percent: {
          type: Number,
          min: 0,
          default: 0,
     },
     exp: {
          type: Number,
          min: 0,
          default: 0,
     },
     userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
     }

}, { timestamps: true });

baseSalarySchema.index({ userId: 1 }, { unique: true });
const BaseSalary = mongoose.model("BaseSalary", baseSalarySchema);

export default BaseSalary;
