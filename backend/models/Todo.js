const db = require('../config/db');

// 内存存储，当数据库未连接时使用
const memoryStore = {
  todos: [],
  lastId: 0,
  
  getNextId() {
    return ++this.lastId;
  },
  
  getAll() {
    return [...this.todos].sort((a, b) => a.position - b.position);
  },
  
  getById(id) {
    return this.todos.find(todo => todo.id === Number(id));
  },
  
  create(todo) {
    const maxPosition = this.todos.length > 0 
      ? Math.max(...this.todos.map(t => t.position)) 
      : 0;
    
    const newTodo = {
      id: this.getNextId(),
      title: todo.title,
      description: todo.description || '',
      completed: false,
      position: maxPosition + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.todos.push(newTodo);
    return newTodo;
  },
  
  update(id, todo) {
    const index = this.todos.findIndex(t => t.id === Number(id));
    if (index === -1) return null;
    
    this.todos[index] = {
      ...this.todos[index],
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      updated_at: new Date().toISOString()
    };
    
    return this.todos[index];
  },
  
  delete(id) {
    const index = this.todos.findIndex(t => t.id === Number(id));
    if (index === -1) return null;
    
    const deletedTodo = this.todos[index];
    const deletedPosition = deletedTodo.position;
    
    // 删除待办事项
    this.todos.splice(index, 1);
    
    // 更新其他待办事项的position
    this.todos.forEach(todo => {
      if (todo.position > deletedPosition) {
        todo.position -= 1;
      }
    });
    
    return deletedTodo;
  },
  
  updatePosition(id, newPosition) {
    const index = this.todos.findIndex(t => t.id === Number(id));
    if (index === -1) return null;
    
    const todo = this.todos[index];
    const currentPosition = todo.position;
    
    if (currentPosition === newPosition) {
      return todo;
    }
    
    // 更新其他待办事项的position
    this.todos.forEach(t => {
      if (currentPosition < newPosition) {
        if (t.position > currentPosition && t.position <= newPosition) {
          t.position -= 1;
        }
      } else {
        if (t.position >= newPosition && t.position < currentPosition) {
          t.position += 1;
        }
      }
    });
    
    // 更新目标待办事项的position
    todo.position = newPosition;
    todo.updated_at = new Date().toISOString();
    
    return todo;
  }
};

class Todo {
  static async getAll() {
    if (!global.databaseConnected) {
      console.log('Using memory store for getAll');
      return memoryStore.getAll();
    }
    
    const result = await db.query(
      'SELECT * FROM todos ORDER BY position ASC'
    );
    return result.rows;
  }

  static async getById(id) {
    if (!global.databaseConnected) {
      console.log(`Using memory store for getById: ${id}`);
      return memoryStore.getById(id);
    }
    
    const result = await db.query(
      'SELECT * FROM todos WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(todo) {
    if (!global.databaseConnected) {
      console.log('Using memory store for create');
      return memoryStore.create(todo);
    }
    
    // 获取最大position值
    const maxPositionResult = await db.query(
      'SELECT MAX(position) FROM todos'
    );
    const maxPosition = maxPositionResult.rows[0].max || 0;
    const newPosition = maxPosition + 1;

    const result = await db.query(
      'INSERT INTO todos (title, description, position) VALUES ($1, $2, $3) RETURNING *',
      [todo.title, todo.description, newPosition]
    );
    return result.rows[0];
  }

  static async update(id, todo) {
    if (!global.databaseConnected) {
      console.log(`Using memory store for update: ${id}`);
      return memoryStore.update(id, todo);
    }
    
    const result = await db.query(
      'UPDATE todos SET title = $1, description = $2, completed = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [todo.title, todo.description, todo.completed, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    if (!global.databaseConnected) {
      console.log(`Using memory store for delete: ${id}`);
      return memoryStore.delete(id);
    }
    
    // 获取要删除的待办事项的position
    const todoResult = await db.query(
      'SELECT position FROM todos WHERE id = $1',
      [id]
    );
    
    if (todoResult.rows.length === 0) {
      return null;
    }
    
    const position = todoResult.rows[0].position;
    
    await db.query('BEGIN');
    
    try {
      // 删除待办事项
      const result = await db.query(
        'DELETE FROM todos WHERE id = $1 RETURNING *',
        [id]
      );
      
      // 更新其他待办事项的position
      await db.query(
        'UPDATE todos SET position = position - 1 WHERE position > $1',
        [position]
      );
      
      await db.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  }

  static async updatePosition(id, newPosition) {
    if (!global.databaseConnected) {
      console.log(`Using memory store for updatePosition: ${id} to ${newPosition}`);
      return memoryStore.updatePosition(id, newPosition);
    }
    
    // 获取当前待办事项的position
    const todoResult = await db.query(
      'SELECT position FROM todos WHERE id = $1',
      [id]
    );
    
    if (todoResult.rows.length === 0) {
      return null;
    }
    
    const currentPosition = todoResult.rows[0].position;
    
    if (currentPosition === newPosition) {
      // 位置没有变化，直接返回
      const result = await db.query(
        'SELECT * FROM todos WHERE id = $1',
        [id]
      );
      return result.rows[0];
    }
    
    await db.query('BEGIN');
    
    try {
      if (currentPosition < newPosition) {
        // 向下移动 - 需要将中间的项目position减1
        await db.query(
          'UPDATE todos SET position = position - 1 WHERE position > $1 AND position <= $2',
          [currentPosition, newPosition]
        );
      } else {
        // 向上移动 - 需要将中间的项目position加1
        await db.query(
          'UPDATE todos SET position = position + 1 WHERE position >= $1 AND position < $2',
          [newPosition, currentPosition]
        );
      }
      
      // 更新目标待办事项的position
      const result = await db.query(
        'UPDATE todos SET position = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [newPosition, id]
      );
      
      await db.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  }
}

module.exports = Todo; 