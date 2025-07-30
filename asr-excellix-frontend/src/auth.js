import { ref } from "vue";
export const isLoggedIn = ref(!!localStorage.getItem("employee"));

export function setLoggedIn(val) {
  isLoggedIn.value = val;
}
