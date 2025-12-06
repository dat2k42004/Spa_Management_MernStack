import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
     username: {
          type: String,
          required: true,
          unique: true,
     },
     password: {
          type: String,
          required: true,
     },
     role: {
          type: {
               type: String,
               enum: ["ADMIN", "USER"],
               default: "USER",
               required: true,
          },
          position: {
               type: String,
               enum: ["MANAGER", "WAREHOUSE", "RECEPTIONIST", "STAFF", "CUSTOMER"],
               default: "CUSTOMER",
               required: true,
          }
     },
     email: {
          type: String,
          required: true,
          unique: true,
     },
     fullName: {
          type: String,
          required: true,
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
     avatar: {
          type: String,
          default: "/uploads/avatars/default_avatar.png",
     }
}, { timestamps: true });

// userSchema.index({ username: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

export default User;