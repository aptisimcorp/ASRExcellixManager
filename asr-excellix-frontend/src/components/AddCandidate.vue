<script setup>
import { ref, defineEmits } from "vue";
const name = ref("");
const email = ref("");
const phone = ref("");
const skills = ref(""); // comma separated
const emit = defineEmits(["added"]);

const addCandidate = async () => {
  await fetch(`${import.meta.env.VITE_API_BASE_URL}/candidates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      phone: phone.value,
      skills: skills.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }),
  });
  alert("Candidate added");
  emit("added");
  name.value = email.value = phone.value = skills.value = "";
};
</script>

<template>
  <form class="row g-2 mb-3" @submit.prevent="addCandidate">
    <div class="col-md-3">
      <input v-model="name" class="form-control" placeholder="Name" />
    </div>
    <div class="col-md-3">
      <input v-model="email" class="form-control" placeholder="Email" />
    </div>
    <div class="col-md-2">
      <input v-model="phone" class="form-control" placeholder="Phone" />
    </div>
    <div class="col-md-3">
      <input
        v-model="skills"
        class="form-control"
        placeholder="Skills (comma separated)"
      />
    </div>
    <div class="col-md-1">
      <button class="btn btn-success w-100" type="submit">Add</button>
    </div>
  </form>
</template>
