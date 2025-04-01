<script setup lang="ts">
import TodoList from '@/components/TodoList.vue';
import TodoForm from '@/components/TodoForm.vue';
</script>

<template>
  <main class="container">
    <TodoForm />
    <TodoList />
  </main>
</template>

<style scoped>
main {
  padding-top: 60px;
}
</style>
