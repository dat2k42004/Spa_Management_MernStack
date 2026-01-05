import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
     name: {
          type: String,
          required: true,
          unique: true,
          index: true,
     },
     status: {
          type: String,
          enum: ["ACTIVE", "INACTIVE"],
          default: "INACTIVE",
     },
     price: {
          type: Number,
          min: 0,
          required: true,
          default: 0,
     },
     description: {
          type: String
     },
     isDeleted: {
          type: Boolean,
          default: false,
          required: true,
     },
     deviceId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Device",
     }
}, { timestamps: true });
// serviceSchema.createIndex({name: 1}, {unique: true});

const Service = mongoose.model("Service", serviceSchema);

export default Service;


