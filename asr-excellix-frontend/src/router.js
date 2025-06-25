import { createRouter, createWebHistory } from "vue-router";
import CandidateList from "./components/CandidateList.vue";
import Dashboard from "./components/Dashboard.vue";
import EmployeeManager from "./components/EmployeeManager.vue";
import EmployeeLogin from "./components/EmployeeLogin.vue";

const routes = [
  { path: "/", component: Dashboard },
  { path: "/login", component: EmployeeLogin },
  { path: "/candidates", component: CandidateList },
  { path: "/employees", component: EmployeeManager },
  { path: "/dashboard", component: Dashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
