import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoDB from "./config/mongodb.js";
import mysqlDB from "./config/mysql.js";
import path from "path";
import colors from "colors";
import http from "http";

// import routes
import router from "./routes/index.js";
dotenv.config(); // load env var
mongoDB(); // connect to mongoDB
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

// test mysql connection
async function testMysqlConnection() {
     try {
          const [rows, fields] = await mysqlDB.query("select now() as now");
          console.log(`[mysql] connected to mysql : ${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}/${process.env.MYSQL_DB}`.cyan.underline.bold);
          return rows;
     }
     catch (error) {
          console.log(`[mysql] error: ${error.message}`.red.underline.bold);
     }
}
testMysqlConnection();



// start server
app.listen(PORT, () => {
     console.log(`[server] running on port ${PORT}`);
})