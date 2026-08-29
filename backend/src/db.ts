import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "123456",
    database: process.env.DB_NAME || "login_facial"
});

db.getConnection()
    .then(connection => {
        console.log("✅ MySQL conectado correctamente");
        connection.release();
    })
    .catch(error => {
        console.log("❌ Error de conexión MySQL:");
        console.log(error.message);
    });