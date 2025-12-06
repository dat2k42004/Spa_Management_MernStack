import mongoose from "mongoose";

const monthSalarySchema = new mongoose.Schema({
     baseSalary: {
          type: Number,
          min: 0,
          default: 0,
     },
     work: {
          type: Number,
          min: 0,
          default: 0,
     },
     revenue: {
          type: Number,
          min: 0,
          default: 0,
     },
     extend: [{
          name: { type: String },
          cost: { type: Number, min: 0 }
     }],
     date: {
          type: String,
          required: true,
     },
     userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
     }
}, { timestamps: true });

const MonthSalary = mongoose.model("MonthSalary", monthSalarySchema);

export default MonthSalary;
