import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface TodoInput {
  title: string;
  description?: string;
}

export interface TodoUpdate extends TodoInput {
  completed?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export default {
  async getAllTodos(): Promise<Todo[]> {
    const response = await apiClient.get<ApiResponse<Todo[]>>('/todos');
    return response.data.data;
  },

  async getTodoById(id: number): Promise<Todo> {
    const response = await apiClient.get<ApiResponse<Todo>>(`/todos/${id}`);
    return response.data.data;
  },

  async createTodo(todo: TodoInput): Promise<Todo> {
    const response = await apiClient.post<ApiResponse<Todo>>('/todos', todo);
    return response.data.data;
  },

  async updateTodo(id: number, todo: TodoUpdate): Promise<Todo> {
    const response = await apiClient.put<ApiResponse<Todo>>(`/todos/${id}`, todo);
    return response.data.data;
  },

  async deleteTodo(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<{}>>(`/todos/${id}`);
  },

  async updateTodoPosition(id: number, position: number): Promise<Todo> {
    const response = await apiClient.patch<ApiResponse<Todo>>(
      `/todos/${id}/position`,
      { position }
    );
    return response.data.data;
  }
}; 