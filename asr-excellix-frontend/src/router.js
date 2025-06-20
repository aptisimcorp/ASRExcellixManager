import { createRouter, createWebHistory } from "vue-router";
import CandidateList from "./components/CandidateList.vue";
import Dashboard from "./components/Dashboard.vue";
import EmployeeManager from "./components/EmployeeManager.vue";

const routes = [
  { path: "/", component: Dashboard },
  { path: "/candidates", component: CandidateList },
  { path: "/employees", component: EmployeeManager },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
