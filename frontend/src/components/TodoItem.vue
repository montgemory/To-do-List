<script setup lang="ts">
import { ref } from 'vue';
import type { Todo } from '@/services/api';

const props = defineProps<{
  todo: Todo;
}>();

const emit = defineEmits<{
  'toggle-status': [id: number];
  'update-todo': [id: number, title: string, description: string];
  'delete-todo': [id: number];
}>();

const isEditing = ref(false);
const editTitle = ref(props.todo.title);
const editDescription = ref(props.todo.description);

function toggleStatus() {
  emit('toggle-status', props.todo.id);
}

function startEditing() {
  isEditing.value = true;
  editTitle.value = props.todo.title;
  editDescription.value = props.todo.description;
}

function cancelEditing() {
  isEditing.value = false;
}

function saveTodo() {
  if (editTitle.value.trim()) {
    emit('update-todo', props.todo.id, editTitle.value, editDescription.value);
    isEditing.value = false;
  }
}

function deleteTodo() {
  if (confirm('确定要删除这个待办事项吗？')) {
    emit('delete-todo', props.todo.id);
  }
}
</script>

<template>
  <div class="todo-item" :class="{ 'todo-completed': todo.completed }">
    <div v-if="!isEditing" class="todo-view">
      <div class="todo-content">
        <div class="checkbox-container">
          <input 
            type="checkbox" 
            :checked="todo.completed"
            @change="toggleStatus" 
            class="todo-checkbox"
            :id="`todo-checkbox-${todo.id}`"
          />
        </div>
        <div class="todo-text">
          <h3 class="todo-title" :class="{ 'completed': todo.completed }">{{ todo.title }}</h3>
          <p v-if="todo.description" class="todo-description">{{ todo.description }}</p>
        </div>
      </div>
      <div class="todo-actions">
        <button @click="startEditing" class="edit-btn">编辑</button>
        <button @click="deleteTodo" class="delete-btn">删除</button>
      </div>
    </div>

    <div v-else class="todo-edit">
      <div class="edit-form">
        <input 
          v-model="editTitle" 
          placeholder="标题" 
          class="edit-title"
          @keyup.enter="saveTodo"
        />
        <textarea 
          v-model="editDescription" 
          placeholder="描述（可选）" 
          class="edit-description"
        ></textarea>
      </div>
      <div class="edit-actions">
        <button @click="saveTodo" class="save-btn">保存</button>
        <button @click="cancelEditing" class="cancel-btn">取消</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.todo-item {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 16px;
  margin-bottom: 12px;
  transition: var(--transition);
}

.todo-item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.todo-view {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.todo-content {
  display: flex;
  align-items: flex-start;
  flex: 1;
  min-width: 0; /* 确保flex子项不会溢出父容器 */
}

.checkbox-container {
  flex: 0 0 24px;
  min-width: 24px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-right: 12px;
  margin-top: 4px;
}

.todo-checkbox {
  cursor: pointer;
  margin: 0;
  padding: 0;
}

.todo-text {
  flex: 1;
  min-width: 0;
  overflow-wrap: break-word;
  word-break: break-all;
}

.todo-title {
  font-size: 1.1rem;
  margin-bottom: 4px;
  font-weight: 500;
}

.todo-title.completed {
  text-decoration: line-through;
  color: var(--gray);
}

.todo-description {
  color: var(--dark-gray);
  font-size: 0.9rem;
}

.todo-actions, .edit-actions {
  display: flex;
  gap: 8px;
  flex: 0 0 auto;
  margin-left: 10px;
}

.edit-btn, .delete-btn, .save-btn, .cancel-btn {
  padding: 4px 8px;
  font-size: 0.9rem;
  white-space: nowrap;
}

.delete-btn, .cancel-btn {
  background-color: transparent;
  color: var(--gray);
}

.delete-btn:hover {
  color: #e53e3e;
}

.todo-edit {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edit-title {
  font-weight: 500;
  font-size: 1.1rem;
}

.edit-description {
  min-height: 60px;
  resize: vertical;
}

.todo-completed {
  background-color: var(--lighter-gray);
}
</style> 