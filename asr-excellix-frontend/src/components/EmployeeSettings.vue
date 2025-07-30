<template>
  <div class="settings-dropdown-wrapper">
    <button class="settings-btn" @click="toggleDropdown" title="Settings">
      <i class="bi bi-gear-fill" style="font-size: 2rem"></i>
    </button>
    <div
      v-if="showDropdown"
      class="settings-dropdown"
      @click.self="closeDropdown"
    >
      <div class="settings-content">
        <div class="user-info">
          <div>
            <b>{{ employee?.name }}</b>
          </div>
          <div class="user-email">{{ employee?.email }}</div>
          <div class="user-role">Role: {{ employee?.role }}</div>
        </div>
        <button class="change-pw-btn" @click="showChangePw = !showChangePw">
          Change Password
        </button>
        <div v-if="showChangePw" class="change-pw-form">
          <input
            v-model="oldPassword"
            type="password"
            placeholder="Old Password"
          />
          <input
            v-model="newPassword"
            type="password"
            placeholder="New Password"
          />
          <button class="submit-btn" @click="changePassword">Submit</button>
          <div
            v-if="pwMsg"
            :class="{ 'success-msg': pwSuccess, 'error-msg': !pwSuccess }"
          >
            {{ pwMsg }}
          </div>
        </div>
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { setLoggedIn } from "../auth.js";
export default {
  name: "EmployeeSettings",
  data() {
    return {
      showDropdown: false,
      showChangePw: false,
      oldPassword: "",
      newPassword: "",
      pwMsg: "",
      pwSuccess: false,
      employee: JSON.parse(localStorage.getItem("employee") || "null"),
    };
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
      if (!this.showDropdown) {
        this.showChangePw = false;
        this.pwMsg = "";
      }
    },
    closeDropdown() {
      this.showDropdown = false;
      this.showChangePw = false;
      this.pwMsg = "";
    },
    async changePassword() {
      this.pwMsg = "";
      this.pwSuccess = false;
      try {
        await axios.post("/api/employees/change-password", {
          email: this.employee.email,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        });
        this.pwMsg = "Password changed successfully.";
        this.pwSuccess = true;
        this.oldPassword = this.newPassword = "";
      } catch (err) {
        this.pwMsg =
          err.response?.data?.message || "Failed to change password.";
        this.pwSuccess = false;
      }
    },
    logout() {
      localStorage.removeItem("employee");
      setLoggedIn(false);
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.settings-dropdown-wrapper {
  position: absolute;
  top: 2em;
  right: 2em;
  z-index: 20;
  font-family: "Inter", sans-serif;
}
.settings-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.settings-dropdown {
  position: absolute;
  top: 2.5em;
  right: 0;
  background: linear-gradient(180deg, #f5f6fa 0%, #e9eafc 100%);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(55, 48, 163, 0.13);
  min-width: 270px;
  padding: 2em 1.5em 1.5em 1.5em;
  z-index: 100;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}
.settings-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #000 !important;
}
.user-info {
  margin-bottom: 1em;
  font-size: 1.08em;
  width: 100%;
}
.user-email {
  font-size: 0.98em;
  color: #555;
}
.user-role {
  font-size: 0.93em;
  color: #888;
}
.change-pw-btn {
  background: #3730a3;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.45em 1.1em;
  margin-bottom: 0.8em;
  cursor: pointer;
  font-size: 1em;
  font-weight: 600;
  transition: background 0.2s;
}
.change-pw-btn:hover {
  background: #2563eb;
}
.change-pw-form {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(55, 48, 163, 0.07);
  padding: 1em 1em 0.7em 1em;
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  margin-bottom: 0.7em;
  width: 100%;
}
.change-pw-form input {
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 0.4em 0.8em;
  font-size: 1em;
}
.submit-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4em 1em;
  margin-top: 0.2em;
  cursor: pointer;
  font-size: 1em;
  font-weight: 600;
  transition: background 0.2s;
}
.submit-btn:hover {
  background: #3730a3;
}
.logout-btn {
  background: #f87171;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5em 1.2em;
  margin-top: 1em;
  cursor: pointer;
  font-size: 1em;
  width: 100%;
  font-weight: 600;
  transition: background 0.2s;
}
.logout-btn:hover {
  background: #dc2626;
}
.success-msg {
  color: #16a34a;
  margin-top: 0.3em;
  font-size: 0.98em;
}
.error-msg {
  color: #dc2626;
  margin-top: 0.3em;
  font-size: 0.98em;
}
</style>
