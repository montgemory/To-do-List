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
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000, // 连接最大空闲时间
  connectionTimeoutMillis: 2000, // 连接超时时间
});

// 测试数据库连接
pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // 不要在这里退出进程，让应用继续运行
});

// 测试连接并重试
const testConnection = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await pool.query('SELECT NOW()');
      console.log('Database connection test successful:', result.rows[0]);
      return true;
    } catch (err) {
      console.error(`Database connection test failed (attempt ${i + 1}/${retries}):`, err);
      if (i < retries - 1) {
        // 等待 5 秒后重试
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  return false;
};

// 初始化数据库连接
testConnection().then(success => {
  if (!success) {
    console.error('Failed to connect to database after multiple attempts');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
}; 