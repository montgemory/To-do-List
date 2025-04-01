const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// 获取所有待办事项
router.get('/', todoController.getAllTodos);

// 获取单个待办事项
router.get('/:id', todoController.getTodoById);

// 创建待办事项
router.post('/', todoController.createTodo);

// 更新待办事项
router.put('/:id', todoController.updateTodo);

// 删除待办事项
router.delete('/:id', todoController.deleteTodo);

// 更新待办事项位置
router.patch('/:id/position', todoController.updateTodoPosition);

module.exports = router; 