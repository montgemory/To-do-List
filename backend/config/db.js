const { Pool } = require('pg');
require('dotenv').config();

// 支持Postgres URL格式的连接字符串（Railway提供）
const connectionString = process.env.DATABASE_URL;
const pool = connectionString 
  ? new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  : new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

module.exports = {
  query: (text, params) => pool.query(text, params),
}; 