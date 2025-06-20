<script setup>
import { ref, watch, defineEmits } from "vue";
const props = defineProps({ candidate: Object });
const emit = defineEmits(["updated", "cancel"]);

const name = ref(props.candidate.name);
const email = ref(props.candidate.email);
const phone = ref(props.candidate.phone);
const skills = ref(
  Array.isArray(props.candidate.skills)
    ? props.candidate.skills.join(", ")
    : props.candidate.skills
);

watch(
  () => props.candidate,
  (newVal) => {
    name.value = newVal.name;
    email.value = newVal.email;
    phone.value = newVal.phone;
    skills.value = Array.isArray(newVal.skills)
      ? newVal.skills.join(", ")
      : newVal.skills;
  }
);

const updateCandidate = async () => {
  await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/candidates/${props.candidate._id}`,
    {
      method: "PUT",
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
    }
  );
  alert("Candidate updated");
  emit("updated");
};
</script>

<template>
  <form class="row g-2 mb-2" @submit.prevent="updateCandidate">
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
    <div class="col-md-1 d-flex gap-1">
      <button class="btn btn-success w-100" type="submit">Save</button>
      <button
        class="btn btn-secondary w-100"
        type="button"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
    </div>
  </form>
</template>
