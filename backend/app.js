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
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 204
};

// 中间件
app.use(cors(corsOptions));
app.use(express.json());

// 路由
app.use('/api/todos', todoRoutes);

// 根路由
app.get('/', (req, res) => {
  res.json({
    message: '欢迎使用TodoList API',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
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
const PORT = process.env.PORT || 3002;

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口: ${PORT}`);
  console.log(`环境: ${process.env.NODE_ENV}`);
  console.log(`前端URL: ${process.env.FRONTEND_URL}`);
});

module.exports = app; 