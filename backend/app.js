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
  origin: function (origin, callback) {
    console.log('Request origin:', origin);
    const allowedOrigins = ['https://to-do-list-andrewwang.vercel.app', 'http://localhost:5173'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origin not allowed:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 204
};

// 中间件
app.use(cors(corsOptions));
app.use(express.json());

// 健康检查路由
app.get('/', (req, res) => {
  res.json({
    message: '欢迎使用TodoList API',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API路由
app.use('/api/todos', todoRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: '服务器错误',
    error: err.message
  });
});

// 获取端口
const PORT = process.env.PORT || 3002;

// 进程错误处理
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// 启动服务器
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在端口: ${PORT}`);
  console.log(`环境: ${process.env.NODE_ENV}`);
  console.log(`前端URL: ${process.env.FRONTEND_URL}`);
});

module.exports = app; 