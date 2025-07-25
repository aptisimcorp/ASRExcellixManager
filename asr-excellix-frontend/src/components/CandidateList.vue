<script setup>
import { ref, computed, onMounted } from "vue";
import AddCandidate from "./AddCandidate.vue";
import EditCandidate from "./EditCandidate.vue";
import CandidateActionModal from "./CandidateActionModal.vue";
import ExportToExcel from "./ExportToExcel.vue";

const candidates = ref([]);
const filterStatus = ref("active");
const nameFilter = ref("");
const showAdd = ref(false);
const editingId = ref(null);
const editingCandidate = ref(null);
const showActionModal = ref(false);
const actionCandidate = ref(null);

const fetchCandidates = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/candidates`);
  candidates.value = await res.json();
  editingId.value = null;
  editingCandidate.value = null;
};

const markComplete = async (id) => {
  await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/candidates/${id}/complete`,
    {
      method: "PATCH",
    }
  );
  fetchCandidates();
};

const filteredCandidates = computed(() => {
  let filtered = candidates.value;
  if (filterStatus.value === "active") {
    filtered = filtered.filter((c) => !c.completed);
  } else if (filterStatus.value === "closed") {
    filtered = filtered.filter((c) => c.completed);
  }
  if (nameFilter.value) {
    filtered = filtered.filter((c) =>
      c.name.toLowerCase().includes(nameFilter.value.toLowerCase())
    );
  }
  // Sort: incomplete first, then completed
  return filtered
    .slice()
    .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
});

const startEdit = (candidate) => {
  editingId.value = candidate._id;
  editingCandidate.value = { ...candidate };
};

const cancelEdit = () => {
  editingId.value = null;
  editingCandidate.value = null;
};

const openActionModal = (candidate) => {
  actionCandidate.value = { ...candidate };
  showActionModal.value = true;
};

const closeActionModal = () => {
  showActionModal.value = false;
  actionCandidate.value = null;
};

onMounted(fetchCandidates);
</script>

<template>
  <div class="container mt-4">
    <h2 class="mb-4">Candidates</h2>
    <div class="d-flex mb-3 align-items-center gap-2">
      <button class="btn btn-primary" @click="showAdd = !showAdd">
        {{ showAdd ? "Close" : "Add New Candidate" }}
      </button>
      <ExportToExcel :data="filteredCandidates" />
      <select v-model="filterStatus" class="form-select w-auto ms-2">
        <option value="active">Active</option>
        <option value="closed">Closed</option>
        <option value="all">All</option>
      </select>
      <input
        v-model="nameFilter"
        class="form-control w-auto ms-2"
        placeholder="Filter by name..."
      />
    </div>
    <AddCandidate v-if="showAdd" @added="fetchCandidates" />
    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Skills</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="c in filteredCandidates"
          :key="c._id"
          :class="{ 'table-success': c.completed }"
        >
          <td v-if="editingId !== c._id">{{ c.name }}</td>
          <td v-else colspan="6">
            <EditCandidate
              :candidate="editingCandidate"
              @updated="fetchCandidates"
              @cancel="cancelEdit"
            />
          </td>
          <td v-if="editingId !== c._id">{{ c.email }}</td>
          <td v-if="editingId !== c._id">{{ c.phone }}</td>
          <td v-if="editingId !== c._id">
            {{ Array.isArray(c.skills) ? c.skills.join(", ") : c.skills }}
          </td>
          <td v-if="editingId !== c._id">
            {{ c.completed ? "Closed" : "Active" }}
          </td>
          <td v-if="editingId !== c._id">
            <button class="btn btn-sm btn-warning me-1" @click="startEdit(c)">
              Update details
            </button>
            <button
              class="btn btn-sm btn-info me-1"
              @click="openActionModal(c)"
            >
              Action
            </button>
            <button
              v-if="!c.completed"
              class="btn btn-sm btn-success"
              @click="markComplete(c._id)"
            >
              Mark Complete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <CandidateActionModal
      v-if="showActionModal"
      :candidate="actionCandidate"
      :show="showActionModal"
      @close="closeActionModal"
      @saved="fetchCandidates"
    />
  </div>
</template>
