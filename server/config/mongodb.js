// config database
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
     try {
          const conn = await mongoose.connect(process.env.MONGO_URI);
          console.log(`[mongodb] MongoDB connected: ${conn.connection.host}`.cyan.underline.bold);
     } catch (error) {
          console.log(`[mongodb] Error: ${error.message}`.red.underline.bold);
          process.exit(1);
     }
}

export default connectDB;