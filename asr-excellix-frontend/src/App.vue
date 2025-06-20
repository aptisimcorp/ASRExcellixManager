<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const goToDashboard = () => router.push("/");
</script>

<template>
  <div class="brand-bar text-center mb-3">
    <img
      src="./assets/images/logo-transparent.png"
      class="brand-logo"
      alt="Brand Logo"
      @click="goToDashboard"
      style="cursor: pointer"
    />
  </div>
  <router-view />
</template>

<style scoped>
.brand-logo {
  height: 12em;
  max-width: 100%;
  padding: 2.5em;
  will-change: filter;
  transition: filter 300ms;
  object-fit: contain;
}
.brand-logo:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.brand-bar {
  background: transparent;
}
</style>
