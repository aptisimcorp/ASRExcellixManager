import { createRouter, createWebHistory } from "vue-router";
import CandidateList from "./components/CandidateList.vue";
import Dashboard from "./components/Dashboard.vue";
import EmployeeManager from "./components/EmployeeManager.vue";
import EmployeeLogin from "./components/EmployeeLogin.vue";

const routes = [
  { path: "/login", component: EmployeeLogin },
  { path: "/", component: Dashboard, meta: { requiresAuth: true } },
  {
    path: "/candidates",
    component: CandidateList,
    meta: { requiresAuth: true },
  },
  {
    path: "/employees",
    component: EmployeeManager,
    meta: { requiresAuth: true },
  },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard: redirect to /login if not authenticated
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("employee");
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.path === "/login" && isAuthenticated) {
    next("/");
  } else {
    next();
  }
});

export default router;
