import mysql from "mysql2";

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.warn("Database connection failed:", err.message);
    console.warn(
      "Server will continue running. Database is required for API calls."
    );
    return;
  }
  console.log("MySQL connected");
});

export default db;
