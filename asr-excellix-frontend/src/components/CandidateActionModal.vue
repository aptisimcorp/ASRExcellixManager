<script setup>
import { ref, watch, onMounted } from "vue";
const props = defineProps({ candidate: Object, show: Boolean });
const emit = defineEmits(["close", "saved"]);

const discussion = ref("");
const nextFollowup = ref("");
const employeeName = ref("");
const conversationHistory = ref([]);
const employeeNames = ref([]);

const fetchConversations = async () => {
  if (!props.candidate?._id) return;
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/candidates/${
      props.candidate._id
    }/conversations`
  );
  conversationHistory.value = await res.json();
};

const fetchEmployeeNames = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL.replace(
      "/api",
      ""
    )}/api/employees/names/all`
  );
  employeeNames.value = await res.json();
};

watch(() => props.candidate, fetchConversations, { immediate: true });
onMounted(() => {
  fetchConversations();
  fetchEmployeeNames();
});

const saveConversation = async () => {
  await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/candidates/${
      props.candidate._id
    }/conversations`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeName: employeeName.value,
        discussion: discussion.value,
        date: nextFollowup.value,
      }),
    }
  );
  discussion.value = "";
  nextFollowup.value = "";
  employeeName.value = "";
  await fetchConversations();
  emit("saved");
};
</script>

<template>
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    style="background: rgba(0, 0, 0, 0.7)"
  >
    <div class="modal-dialog">
      <div class="modal-content bg-dark text-light">
        <div class="modal-header">
          <h5 class="modal-title">Candidate Action: {{ candidate.name }}</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="$emit('close')"
          ></button>
        </div>
        <div class="modal-body">
          <label>Discussion</label>
          <textarea
            class="form-control mb-2"
            rows="2"
            v-model="discussion"
          ></textarea>
          <label>Next Follow-up Date/Time</label>
          <input
            type="datetime-local"
            class="form-control mb-2"
            v-model="nextFollowup"
          />
          <label>Employee Name</label>
          <select class="form-control mb-2" v-model="employeeName">
            <option value="" disabled>Select Employee</option>
            <option v-for="name in employeeNames" :key="name" :value="name">
              {{ name }}
            </option>
          </select>
          <button class="btn btn-success mb-3" @click="saveConversation">
            Save Conversation
          </button>
          <h6>Conversation History</h6>
          <table class="table table-bordered table-dark table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Discussion</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="conv in conversationHistory" :key="conv._id">
                <td>{{ new Date(conv.date).toLocaleString() }}</td>
                <td>{{ conv.employeeName }}</td>
                <td>{{ conv.discussion }}</td>
              </tr>
              <tr v-if="!conversationHistory.length">
                <td colspan="3">No conversation history.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
