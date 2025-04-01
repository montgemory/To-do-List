<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTodoStore } from '@/stores/todo';
import TodoItem from '@/components/TodoItem.vue';
import Sortable from 'sortablejs';

// 定义Sortable.js的事件类型
interface SortableEvent {
  item: HTMLElement;
  newIndex: number | null;
  oldIndex: number;
}

const todoStore = useTodoStore();
const listEl = ref<HTMLElement | null>(null);

onMounted(() => {
  todoStore.fetchTodos();
  
  // 初始化拖拽排序
  if (listEl.value) {
    Sortable.create(listEl.value, {
      animation: 150,
      onEnd: async (evt: SortableEvent) => {
        const todoId = Number(evt.item.getAttribute('data-id'));
        const newPosition = evt.newIndex || 0;
        
        await todoStore.updateTodoPosition(todoId, newPosition);
      }
    });
  }
});

// 处理待办事项各种操作
function handleToggleStatus(id: number) {
  todoStore.toggleTodoStatus(id);
}

function handleUpdateTodo(id: number, title: string, description: string) {
  todoStore.updateTodo(id, { title, description });
}

function handleDeleteTodo(id: number) {
  todoStore.deleteTodo(id);
}

function createNewTodo() {
  todoStore.createTodo({
    title: '新建待办事项',
    description: '点击编辑按钮修改内容'
  });
}

function setFilter(filter: 'all' | 'active' | 'completed') {
  todoStore.setFilter(filter);
}
</script>

<template>
  <div class="todo-list-container">
    <div class="header">
      <h1 class="title">待办事项</h1>
      <button @click="createNewTodo" class="add-btn">新建</button>
    </div>

    <div class="filters">
      <button 
        @click="setFilter('all')" 
        :class="{ active: todoStore.filter === 'all' }"
        class="filter-btn"
      >
        全部
      </button>
      <button 
        @click="setFilter('active')" 
        :class="{ active: todoStore.filter === 'active' }"
        class="filter-btn"
      >
        未完成
      </button>
      <button 
        @click="setFilter('completed')" 
        :class="{ active: todoStore.filter === 'completed' }"
        class="filter-btn"
      >
        已完成
      </button>
    </div>

    <div v-if="todoStore.loading" class="loading">
      加载中...
    </div>

    <div v-else-if="todoStore.error" class="error">
      加载失败: {{ todoStore.error }}
    </div>

    <div v-else-if="todoStore.filteredTodos.length === 0" class="empty-state">
      <p>没有待办事项</p>
      <button @click="createNewTodo" class="create-btn">创建一个</button>
    </div>

    <div v-else ref="listEl" class="todo-list">
      <div 
        v-for="todo in todoStore.filteredTodos" 
        :key="todo.id"
        :data-id="todo.id"
        class="todo-item-wrapper"
      >
        <TodoItem 
          :todo="todo"
          @toggle-status="handleToggleStatus"
          @update-todo="handleUpdateTodo"
          @delete-todo="handleDeleteTodo"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.todo-list-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title {
  font-size: 1.8rem;
  font-weight: 600;
}

.add-btn {
  padding: 8px 16px;
  font-weight: bold;
}

.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.filter-btn {
  background-color: transparent;
  color: var(--dark-gray);
  border: 1px solid var(--light-gray);
  padding: 6px 12px;
  font-size: 0.9rem;
}

.filter-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.todo-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.loading, .error, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: var(--gray);
}

.empty-state {
  text-align: center;
}

.create-btn {
  margin-top: 12px;
}

/* 拖拽时的样式 */
.sortable-ghost {
  opacity: 0.5;
}

.sortable-chosen {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style> 