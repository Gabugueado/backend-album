import express from 'express'
import mysql from 'mysql'
import cors from 'cors'

import mysqlroutes from "./routes/mysql.js";
import firebaseroutes from "./routes/firebase.js";




// crear express app
const app = express()

// settings
app.set("port", process.env.PORT || 4000);

// configuracion base de datos
export const connection = mysql.createConnection({
    host: 'localhost',
    database: 'album_videos',
    user: 'root',
    password: 'Abcd1234!',
    charset: 'utf8mb4',
    multipleStatements: true,

});
connection.connect()

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(mysqlroutes);
app.use(firebaseroutes);

// starting the server
app.listen(app.get("port"), () => {
    console.log(`Server on port ${app.get("port")}`);
});