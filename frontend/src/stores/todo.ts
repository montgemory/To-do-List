import { defineStore } from 'pinia';
import api from '@/services/api';
import type { Todo, TodoInput, TodoUpdate } from '@/services/api';

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'completed' | 'active';
}

export const useTodoStore = defineStore('todo', {
  state: (): TodoState => ({
    todos: [],
    loading: false,
    error: null,
    filter: 'all'
  }),

  getters: {
    filteredTodos: (state) => {
      switch (state.filter) {
        case 'completed':
          return state.todos.filter(todo => todo.completed);
        case 'active':
          return state.todos.filter(todo => !todo.completed);
        default:
          return state.todos;
      }
    },
    
    getTodoById: (state) => {
      return (id: number) => state.todos.find(todo => todo.id === id);
    }
  },

  actions: {
    async fetchTodos() {
      this.loading = true;
      this.error = null;
      
      try {
        this.todos = await api.getAllTodos();
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取待办事项失败';
        console.error('获取待办事项失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async createTodo(todoInput: TodoInput) {
      this.loading = true;
      this.error = null;
      
      try {
        // 如果没有提供标题，使用默认中文标题
        if (!todoInput.title) {
          todoInput.title = '新建待办事项';
        }
        // 确保描述是中文
        if (!todoInput.description) {
          todoInput.description = '点击编辑修改内容';
        }
        
        const newTodo = await api.createTodo(todoInput);
        this.todos.push(newTodo);
      } catch (error) {
        this.error = error instanceof Error ? error.message : '创建待办事项失败';
        console.error('创建待办事项失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateTodo(id: number, todoUpdate: TodoUpdate) {
      this.loading = true;
      this.error = null;
      
      try {
        const updatedTodo = await api.updateTodo(id, todoUpdate);
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
          this.todos[index] = updatedTodo;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '更新待办事项失败';
        console.error('更新待办事项失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteTodo(id: number) {
      this.loading = true;
      this.error = null;
      
      try {
        await api.deleteTodo(id);
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
          this.todos.splice(index, 1);
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '删除待办事项失败';
        console.error('删除待办事项失败:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateTodoPosition(id: number, newPosition: number) {
      this.loading = true;
      this.error = null;
      
      try {
        const updatedTodo = await api.updateTodoPosition(id, newPosition);
        // 重新获取所有待办事项以确保排序一致
        await this.fetchTodos();
        return updatedTodo;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '更新待办事项位置失败';
        console.error('更新待办事项位置失败:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    setFilter(filter: 'all' | 'completed' | 'active') {
      this.filter = filter;
    },
    
    async toggleTodoStatus(id: number) {
      const todo = this.getTodoById(id);
      if (todo) {
        await this.updateTodo(id, {
          title: todo.title,
          description: todo.description,
          completed: !todo.completed
        });
      }
    }
  }
}); 