<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const employeeCount = ref(0);
const candidateCount = ref(0);
const followupCount = ref(0);
const followupCandidates = ref([]);
const showFollowupModal = ref(false);

const fetchCounts = async () => {
  const empRes = await fetch(
    `${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}/api/employees`
  );
  const employees = await empRes.json();
  employeeCount.value = employees.length;
  const candRes = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/candidates`
  );
  const candidates = await candRes.json();
  candidateCount.value = candidates.length;
  const followupRes = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/candidates/followups/today`
  );
  const followups = await followupRes.json();
  followupCandidates.value = followups;
  followupCount.value = followups.length;
};

const openFollowupModal = () => {
  showFollowupModal.value = true;
};
const closeFollowupModal = () => {
  showFollowupModal.value = false;
};

onMounted(fetchCounts);
</script>

<template>
  <div class="container mt-5">
    <div class="row g-4 justify-content-center">
      <div class="col-md-4">
        <div
          class="dashboard-tile tile-emp text-light h-100 shadow d-flex flex-column align-items-center justify-content-center"
          @click="router.push('/employees')"
        >
          <div class="tile-icon mb-2">
            <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
              />
            </svg>
          </div>
          <div class="tile-count">{{ employeeCount }}</div>
          <div class="tile-label">Employees</div>
          <div class="tile-desc">Manage Employees</div>
        </div>
      </div>
      <div class="col-md-4">
        <div
          class="dashboard-tile tile-cand text-light h-100 shadow d-flex flex-column align-items-center justify-content-center"
          @click="router.push('/candidates')"
        >
          <div class="tile-icon mb-2">
            <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
              />
              <circle cx="17" cy="7" r="3" />
              <circle cx="7" cy="7" r="3" />
            </svg>
          </div>
          <div class="tile-count">{{ candidateCount }}</div>
          <div class="tile-label">Candidates</div>
          <div class="tile-desc">Manage Candidates</div>
        </div>
      </div>
      <div class="col-md-4">
        <div
          class="dashboard-tile tile-followup text-light h-100 shadow d-flex flex-column align-items-center justify-content-center"
          @click="openFollowupModal"
        >
          <div class="tile-icon mb-2">
            <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V8h14v13zm0-15H5V5h14v1z"
              />
            </svg>
          </div>
          <div class="tile-count">{{ followupCount }}</div>
          <div class="tile-label">Pending Follow-ups</div>
          <div class="tile-desc">For Today</div>
        </div>
      </div>
    </div>
    <!-- Modal for follow-up candidates -->
    <div
      v-if="showFollowupModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background: rgba(0, 0, 0, 0.7)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h5 class="modal-title">Pending Follow-ups for Today</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeFollowupModal"
            ></button>
          </div>
          <div class="modal-body">
            <table class="table table-bordered table-dark table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Skills</th>
                  <th>Follow-up Date/Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in followupCandidates" :key="c._id">
                  <td>{{ c.name }}</td>
                  <td>{{ c.email }}</td>
                  <td>{{ c.phone }}</td>
                  <td>
                    {{
                      Array.isArray(c.skills) ? c.skills.join(", ") : c.skills
                    }}
                  </td>
                  <td>
                    {{
                      c.nextFollowup
                        ? new Date(c.nextFollowup).toLocaleString()
                        : ""
                    }}
                  </td>
                </tr>
                <tr v-if="!followupCandidates.length">
                  <td colspan="5">No pending follow-ups for today.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeFollowupModal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-tile {
  background: #23272b;
  border-radius: 1.5em;
  min-height: 240px;
  min-width: 340px;
  max-width: 100%;
  width: 100%;
  cursor: pointer;
  transition: background 0.3s, box-shadow 0.3s, transform 0.2s;
  box-shadow: 0 4px 24px 0 #000a;
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.dashboard-tile:hover {
  background: #343a40;
  box-shadow: 0 8px 32px 0 #000c;
  transform: translateY(-4px) scale(1.04);
}
.tile-icon {
  color: #6bc5f8;
}
.tile-count {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 0.2em;
}
.tile-label {
  font-size: 1.5rem;
  font-weight: 600;
}
.tile-desc {
  font-size: 1.1rem;
  color: #b0b0b0;
}
.tile-emp .tile-icon {
  color: #f8d36b;
}
.tile-cand .tile-icon {
  color: #6bc5f8;
}
.tile-followup .tile-icon {
  color: #f86b6b;
}
@media (max-width: 767px) {
  .dashboard-tile {
    min-width: 90vw;
    min-height: 180px;
  }
}
</style>
