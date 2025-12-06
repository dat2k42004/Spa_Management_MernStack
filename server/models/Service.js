import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
          unique: true,
     },
     status: {
          type: String,
          enum: ["ACTIVE", "INACTIVE"],
          default: "INACTIVE",
     },
     listedPrice: {
          type: Number,
          min: 0,
          required: true,
     },
     description: {
          type: String
     }
}, { timestamps: true });
// serviceSchema.createIndex({name: 1}, {unique: true});

const Service = mongoose.model("Service", serviceSchema);

export default Service;


