const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

console.log('Database configuration:', {
  isProduction,
  hasDatabaseUrl: !!process.env.DATABASE_URL,
  hasDbHost: !!process.env.DB_HOST,
  hasDbPort: !!process.env.DB_PORT,
  hasDbUser: !!process.env.DB_USER,
  hasDbPassword: !!process.env.DB_PASSWORD,
  hasDbName: !!process.env.DB_NAME
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

// 测试数据库连接
pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// 测试连接
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection test failed:', err);
    process.exit(-1);
  }
  console.log('Database connection test successful:', res.rows[0]);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
}; 