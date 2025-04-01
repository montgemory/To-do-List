const Todo = require('../models/Todo');

// 获取所有待办事项
exports.getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.getAll();
    res.status(200).json({
      success: true,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 获取单个待办事项
exports.getTodoById = async (req, res) => {
  try {
    const todo = await Todo.getById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: '未找到待办事项'
      });
    }
    
    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 创建待办事项
exports.createTodo = async (req, res) => {
  try {
    // 验证请求
    if (!req.body.title) {
      return res.status(400).json({
        success: false,
        message: '标题是必填字段'
      });
    }
    
    const todo = await Todo.create({
      title: req.body.title,
      description: req.body.description || ''
    });
    
    res.status(201).json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 更新待办事项
exports.updateTodo = async (req, res) => {
  try {
    // 验证请求
    if (!req.body.title) {
      return res.status(400).json({
        success: false,
        message: '标题是必填字段'
      });
    }
    
    // 检查待办事项是否存在
    const existingTodo = await Todo.getById(req.params.id);
    
    if (!existingTodo) {
      return res.status(404).json({
        success: false,
        message: '未找到待办事项'
      });
    }
    
    const todo = await Todo.update(req.params.id, {
      title: req.body.title,
      description: req.body.description || existingTodo.description,
      completed: req.body.completed !== undefined ? req.body.completed : existingTodo.completed
    });
    
    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 删除待办事项
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.delete(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: '未找到待办事项'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

// 更新待办事项位置
exports.updateTodoPosition = async (req, res) => {
  try {
    // 验证请求
    if (req.body.position === undefined) {
      return res.status(400).json({
        success: false,
        message: 'position是必填字段'
      });
    }
    
    // 检查待办事项是否存在
    const existingTodo = await Todo.getById(req.params.id);
    
    if (!existingTodo) {
      return res.status(404).json({
        success: false,
        message: '未找到待办事项'
      });
    }
    
    const todo = await Todo.updatePosition(req.params.id, req.body.position);
    
    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
}; 