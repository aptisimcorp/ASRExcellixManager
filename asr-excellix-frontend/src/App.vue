<script setup>
import { useRouter } from "vue-router";
import Loader from "./components/Loader.vue";
import EmployeeSettings from "./components/EmployeeSettings.vue";
import { isLoading } from "./loading.js";
import { isLoggedIn } from "./auth.js";
const router = useRouter();
const goToDashboard = () => router.push("/");
</script>

<template>
  <Loader :show="isLoading" />
  <div
    v-if="isLoggedIn"
    class="brand-bar d-flex align-items-start justify-content-between mb-3 px-3"
    style="position: relative"
  >
    <img
      src="./assets/images/logo-transparent.png"
      class="brand-logo"
      alt="Brand Logo"
      @click="goToDashboard"
      style="cursor: pointer"
    />
    <div class="ms-auto mt-2">
      <EmployeeSettings />
    </div>
  </div>
  <router-view />
</template>

<style scoped>
.brand-logo {
  max-width: 150px;
  padding: 0.5em 0 0.5em 0;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  will-change: filter;
  transition: filter 300ms;
  object-fit: contain;
}
.brand-logo:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.brand-bar {
  background: transparent;
  min-height: 0;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}
</style>
