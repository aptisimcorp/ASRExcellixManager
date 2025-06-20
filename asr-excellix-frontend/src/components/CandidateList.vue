<script setup>
import { ref, onMounted } from "vue";
import AddCandidate from "./AddCandidate.vue";
import EditCandidate from "./EditCandidate.vue";
import CandidateActionModal from "./CandidateActionModal.vue";

const candidates = ref([]);
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
    <button class="btn btn-primary mb-3" @click="showAdd = !showAdd">
      {{ showAdd ? "Close" : "Add New Candidate" }}
    </button>
    <AddCandidate v-if="showAdd" @added="fetchCandidates" />
    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Skills</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in candidates" :key="c._id">
          <td v-if="editingId !== c._id">{{ c.name }}</td>
          <td v-else colspan="5">
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
            <button class="btn btn-sm btn-warning me-1" @click="startEdit(c)">
              Update details
            </button>
            <button class="btn btn-sm btn-info" @click="openActionModal(c)">
              Action
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
