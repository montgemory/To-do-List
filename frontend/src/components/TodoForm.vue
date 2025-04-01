<script setup lang="ts">
import { ref } from 'vue';
import { useTodoStore } from '@/stores/todo';
import type { TodoInput } from '@/services/api';

const todoStore = useTodoStore();

const title = ref('');
const description = ref('');
const isFormOpen = ref(false);

function openForm() {
  isFormOpen.value = true;
}

function closeForm() {
  isFormOpen.value = false;
  title.value = '';
  description.value = '';
}

async function submitTodo() {
  if (!title.value.trim()) return;
  
  const newTodo: TodoInput = {
    title: title.value,
    description: description.value
  };
  
  await todoStore.createTodo(newTodo);
  closeForm();
}
</script>

<template>
  <div class="todo-form-container">
    <div v-if="!isFormOpen" class="new-todo-placeholder" @click="openForm">
      <span class="plus-icon">+</span>
      <span>添加新待办事项</span>
    </div>
    
    <div v-else class="todo-form">
      <input 
        v-model="title"
        placeholder="输入待办事项标题" 
        class="todo-title-input"
        ref="titleInput"
        @keyup.enter="submitTodo"
      />
      <textarea 
        v-model="description"
        placeholder="添加描述（可选）" 
        class="todo-description-input"
      ></textarea>
      
      <div class="form-actions">
        <button @click="submitTodo" class="submit-btn" :disabled="!title.trim()">
          添加
        </button>
        <button @click="closeForm" class="cancel-btn">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.todo-form-container {
  margin-bottom: 24px;
}

.new-todo-placeholder {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--lighter-gray);
  border-radius: var(--border-radius);
  color: var(--dark-gray);
  cursor: pointer;
  transition: var(--transition);
}

.new-todo-placeholder:hover {
  background-color: var(--light-gray);
}

.plus-icon {
  font-size: 18px;
  margin-right: 8px;
  font-weight: bold;
}

.todo-form {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-title-input {
  font-weight: 500;
  font-size: 1.1rem;
}

.todo-description-input {
  min-height: 80px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.submit-btn, .cancel-btn {
  padding: 8px 16px;
}

.cancel-btn {
  background-color: transparent;
  color: var(--gray);
}
</style> 