import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
});

(async () => {
  try {
    const [tables] = await db.query<RowDataPacket[]>("SHOW TABLES");
    console.log(
      " Tablas existentes de mi DB:",
      tables.map((c: any) => Object.values(c)[0])
    );
    console.log(" Conectado a la base de datos correctamente");
  } catch (err) {
    console.error("Hubo un error al conectar a la base de datos:", err);
    process.exit(1);
  }
})();

export default db;
