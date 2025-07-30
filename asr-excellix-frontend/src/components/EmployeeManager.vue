<script setup>
import { ref, onMounted } from "vue";

const employees = ref([]);
const showAdd = ref(false);
const editingId = ref(null);
const form = ref({
  name: "",
  phone: "",
  email: "",
  address: "",
  qualification: "",
  dateOfJoining: "",
});

const fetchEmployees = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}/api/employees`
  );
  employees.value = await res.json();
  editingId.value = null;
  form.value = {
    name: "",
    phone: "",
    email: "",
    address: "",
    qualification: "",
    dateOfJoining: "",
  };
};

const saveEmployee = async () => {
  if (editingId.value) {
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}/api/employees/${
        editingId.value
      }`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.value),
      }
    );
  } else {
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}/api/employees`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.value),
      }
    );
  }
  await fetchEmployees();
  showAdd.value = false;
};

const editEmployee = (emp) => {
  editingId.value = emp._id;
  form.value = {
    ...emp,
    dateOfJoining: emp.dateOfJoining ? emp.dateOfJoining.substring(0, 10) : "",
  };
  showAdd.value = true;
};

const deleteEmployee = async (id) => {
  await fetch(
    `${import.meta.env.VITE_API_BASE_URL.replace(
      "/api",
      ""
    )}/api/employees/${id}`,
    { method: "DELETE" }
  );
  await fetchEmployees();
};

onMounted(fetchEmployees);
</script>

<template>
  <div class="container mt-4">
    <h2 class="mb-4">Employees</h2>
    <button
      class="btn btn-primary mb-3"
      @click="
        showAdd = !showAdd;
        editingId = null;
        form = {
          name: '',
          phone: '',
          email: '',
          address: '',
          qualification: '',
          dateOfJoining: '',
        };
      "
    >
      {{ showAdd ? "Close" : "Add New Employee" }}
    </button>
    <form v-if="showAdd" class="row g-2 mb-3" @submit.prevent="saveEmployee">
      <div class="col-md-2">
        <input
          v-model="form.name"
          class="form-control"
          placeholder="Name"
          required
        />
      </div>
      <div class="col-md-2">
        <input v-model="form.phone" class="form-control" placeholder="Phone" />
      </div>
      <div class="col-md-2">
        <input v-model="form.email" class="form-control" placeholder="Email" />
      </div>
      <div class="col-md-2">
        <input
          v-model="form.address"
          class="form-control"
          placeholder="Address"
        />
      </div>
      <div class="col-md-2">
        <input
          v-model="form.qualification"
          class="form-control"
          placeholder="Qualification"
        />
      </div>
      <div class="col-md-2">
        <input
          v-model="form.dateOfJoining"
          type="date"
          class="form-control"
          placeholder="Date of Joining"
        />
      </div>
      <div class="col-md-12 mt-2">
        <button class="btn btn-success me-2" type="submit">
          {{ editingId ? "Update" : "Add" }}
        </button>
        <button
          class="btn btn-secondary"
          type="button"
          @click="showAdd = false"
        >
          Cancel
        </button>
      </div>
    </form>
    <table class="table table-bordered table-striped">
      <thead class="table-dark">
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Address</th>
          <th>Qualification</th>
          <th>Date of Joining</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emp in employees" :key="emp._id">
          <td>{{ emp.name }}</td>
          <td>{{ emp.phone }}</td>
          <td>{{ emp.email }}</td>
          <td>{{ emp.address }}</td>
          <td>{{ emp.qualification }}</td>
          <td>
            {{ emp.dateOfJoining ? emp.dateOfJoining.substring(0, 10) : "" }}
          </td>
          <td>
            <button
              class="btn btn-link p-0 me-2"
              title="Edit"
              @click="editEmployee(emp)"
              style="color: #ffc107"
            >
              <i class="bi bi-pencil-square fs-5"></i>
            </button>
            <button
              class="btn btn-link p-0"
              title="Delete"
              @click="deleteEmployee(emp._id)"
              style="color: #dc3545"
            >
              <i class="bi bi-trash fs-5"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
