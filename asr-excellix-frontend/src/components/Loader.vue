<template>
  <div v-if="show" class="loader-overlay">
    <div class="loader"></div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
defineProps({ show: Boolean });
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.6);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
