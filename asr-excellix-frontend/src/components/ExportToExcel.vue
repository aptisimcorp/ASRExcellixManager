<template>
  <button class="btn btn-success mb-3" @click="exportToExcel">
    Export to Excel
  </button>
</template>

<script setup>
import { defineProps } from "vue";
import * as XLSX from "xlsx";

const props = defineProps({
  data: Array,
});

function exportToExcel() {
  const ws = XLSX.utils.json_to_sheet(props.data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Candidates");
  XLSX.writeFile(wb, "candidates.xlsx");
}
</script>

<style scoped>
.btn-success {
  background-color: #28a745;
  color: white;
}
</style>
