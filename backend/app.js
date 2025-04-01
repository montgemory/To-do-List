const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 导入路由
const todoRoutes = require('./routes/todoRoutes');

// 初始化Express应用
const app = express();

// CORS配置
const corsOptions = {
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'https://your-vercel-app.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
};

// 中间件
app.use(cors(corsOptions)); // 处理跨域
app.use(express.json()); // 解析JSON请求体

// 路由
app.use('/api/todos', todoRoutes);

// 根路由
app.get('/', (req, res) => {
  res.send('欢迎使用TodoList API');
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器错误',
    error: err.message
  });
});

// 获取端口
const PORT = process.env.PORT || 3000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口: ${PORT}`);
});

module.exports = app; 