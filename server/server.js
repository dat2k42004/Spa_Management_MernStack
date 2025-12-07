import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import path from "path";
import colors from "colors";
import http from "http";

// import routes
import router from "./routes/index.js";
dotenv.config(); // load env var
connectDB(); // connect to database
const PORT = process.env.PORT || 8080;

// create express app
const app = express(); // create express app

// middlewares
app.use(express.json()); // parse json request body
app.use(cors({ origin: process.env.CLIENT_URL })); // config cors


// create socket server
const server = http.createServer(app);


// config static folder
app.use("/uploads", express.static(path.join(import.meta.dirname, "/uploads")));

// routes
app.get("/", (req, res) => {
     res.send("API is running...!");
});
app.use("/api", router);



// error handling
// app.use(notFound);



// start server
app.listen(PORT, () => {
     console.log(`[server] running on port ${PORT}`);
})