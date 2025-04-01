const db = require('../config/db');

class Todo {
  // 获取所有待办事项，按position排序
  static async getAll() {
    const result = await db.query(
      'SELECT * FROM todos ORDER BY position ASC'
    );
    return result.rows;
  }

  // 根据ID获取待办事项
  static async getById(id) {
    const result = await db.query(
      'SELECT * FROM todos WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // 创建待办事项
  static async create(todo) {
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

  // 更新待办事项
  static async update(id, todo) {
    const result = await db.query(
      'UPDATE todos SET title = $1, description = $2, completed = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [todo.title, todo.description, todo.completed, id]
    );
    return result.rows[0];
  }

  // 删除待办事项
  static async delete(id) {
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

  // 更新待办事项的排序
  static async updatePosition(id, newPosition) {
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