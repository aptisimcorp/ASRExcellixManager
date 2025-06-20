<script setup>
import { ref, onMounted } from "vue";
const candidates = ref([]);

onMounted(async () => {
  const response = await fetch("http://localhost:5000/api/candidates");
  candidates.value = await response.json();
});
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white p-6">
    <div class="text-center mb-10">
      <img src="/vite.svg" alt="Vite" class="inline w-16 h-16 mx-2" />
      <img src="/vue.svg" alt="Vue" class="inline w-16 h-16 mx-2" />
      <h1 class="text-3xl font-bold mt-4">Candidates</h1>
      <button
        class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg shadow-md transition"
      >
        Add New Candidate
      </button>
    </div>

    <!-- Cards on mobile, Table on md+ -->
    <div class="space-y-4 md:hidden">
      <div
        v-for="candidate in candidates"
        :key="candidate.id"
        class="bg-gray-800 p-4 rounded-xl shadow-lg"
      >
        <h2 class="text-xl font-semibold mb-2">{{ candidate.name }}</h2>
        <p><span class="font-semibold">Email:</span> {{ candidate.email }}</p>
        <p><span class="font-semibold">Phone:</span> {{ candidate.phone }}</p>
        <p><span class="font-semibold">Skills:</span> {{ candidate.skills }}</p>
        <button
          class="mt-3 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
        >
          Update details
        </button>
      </div>
    </div>

    <!-- Table view for medium+ screens -->
    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-full bg-gray-800 rounded-xl overflow-hidden">
        <thead class="bg-gray-700 text-white text-left">
          <tr>
            <th class="p-3">Name</th>
            <th class="p-3">Email</th>
            <th class="p-3">Phone</th>
            <th class="p-3">Skills</th>
            <th class="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="candidate in candidates"
            :key="candidate.id"
            class="border-t border-gray-700 hover:bg-gray-700 transition"
          >
            <td class="p-3">{{ candidate.name }}</td>
            <td class="p-3">{{ candidate.email }}</td>
            <td class="p-3">{{ candidate.phone }}</td>
            <td class="p-3">{{ candidate.skills }}</td>
            <td class="p-3">
              <button
                class="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
              >
                Update details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
