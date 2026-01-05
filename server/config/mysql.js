import mysql from "mysql2";

const pool = mysql.createPool({
     host: process.env.MYSQL_HOST,
     port: process.env.MYSQL_PORT,
     user: process.env.MYSQL_USER,
     password: process.env.MYSQL_PASS,
     database: process.env.MYSQL_DB,

     // pool config options
     waitForConnections: true, // wait for connections instead of throwing error
     connectionLimit: 10, // maximum number of connections in pool
     queryLimit: 0, // unlimited query limit
     enableKeepAlive: true, // keep connection always alive
     keepAliveInitialDelay: 10000,
})

// change to promise to use async / await
const promisePool = pool.promise();

export default promisePool;