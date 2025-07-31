<template>
  <div class="login-bg">
    <div class="login-center">
      <div class="login-card">
        <img
          src="../assets/images/logo-transparent.png"
          alt="Logo"
          class="login-logo"
        />

        <p class="login-subtitle">Welcome back! Please enter your details.</p>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="input-group">
            <input
              v-model="email"
              id="email"
              type="email"
              placeholder="Email"
              class="login-input"
              required
              autocomplete="username"
            />
          </div>
          <div class="input-group">
            <input
              v-model="password"
              id="password"
              type="password"
              placeholder="Password"
              class="login-input"
              required
              autocomplete="current-password"
            />
          </div>
          <div class="login-forgot">
            <a href="#" class="forgot-link" @click.prevent="showForgot = true"
              >Forgot password?</a
            >
          </div>
          <button class="login-btn" :disabled="loading">
            <span v-if="loading">Logging in...</span>
            <span v-else>Login</span>
          </button>
          <div v-if="error" class="error-msg">{{ error }}</div>
        </form>
        <div v-if="showForgot" class="forgot-modal">
          <div class="forgot-content">
            <h4>Forgot Password</h4>
            <input
              v-model="forgotEmail"
              type="email"
              placeholder="Enter your email"
              class="login-input"
            />
            <button
              class="login-btn"
              @click="handleForgot"
              :disabled="forgotLoading"
            >
              <span v-if="forgotLoading">Sending...</span>
              <span v-else>Send Reset Link</span>
            </button>
            <div
              v-if="forgotMsg"
              :class="{
                'success-msg': forgotSuccess,
                'error-msg': !forgotSuccess,
              }"
            >
              {{ forgotMsg }}
            </div>
            <button class="close-btn" @click="showForgot = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { setLoggedIn } from "../auth.js";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
export default {
  name: "EmployeeLogin",
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      error: "",
      showForgot: false,
      forgotEmail: "",
      forgotMsg: "",
      forgotSuccess: false,
      forgotLoading: false,
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = "";
      try {
        const res = await axios.post(`${API_BASE}/employees/login`, {
          email: this.email,
          password: this.password,
        });
        // Save employee info to localStorage or state
        localStorage.setItem("employee", JSON.stringify(res.data.employee));
        setLoggedIn(true);
        this.$router.push("/dashboard");
      } catch (err) {
        this.error = err.response?.data?.message || "Login failed.";
      } finally {
        this.loading = false;
      }
    },
    async handleForgot() {
      this.forgotMsg = "";
      this.forgotSuccess = false;
      this.forgotLoading = true;
      try {
        await axios.post(`${API_BASE}/employees/forgot-password`, {
          email: this.forgotEmail,
        });
        this.forgotMsg = "Password reset email sent. Please check your inbox.";
        this.forgotSuccess = true;
      } catch (err) {
        this.forgotMsg =
          err.response?.data?.message || "Failed to send reset email.";
        this.forgotSuccess = false;
      } finally {
        this.forgotLoading = false;
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");
.login-bg {
  min-height: 100vh;
  /* background: linear-gradient(180deg, #f5f6fa 0%, #e9eafc 100%); */
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Inter", sans-serif;
}
.login-center {
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-card {
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 12px 40px rgba(55, 48, 163, 0.13);
  padding: 3rem 2.5rem 2.5rem 2.5rem;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-logo {
  max-width: 150px;
  margin-bottom: 1.5rem;
}
.login-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #3730a3;
  margin-bottom: 0.6rem;
  text-align: center;
  letter-spacing: -1px;
}
.login-subtitle {
  font-size: 1.13rem;
  color: #3730a3;
  margin-bottom: 2.2rem;
  text-align: center;
  font-weight: 400;
}
.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.input-group {
  width: 100%;
}
.login-input {
  width: 100%;
  padding: 1.1rem 1.2rem;
  border: 1.5px solid #c7d2fe;
  border-radius: 14px;
  font-size: 1.13rem;
  outline: none;
  background: #f5f6fa;
  color: #3730a3;
  font-weight: 500;
  transition: border 0.2s, background 0.2s;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.04);
}
.login-input:focus {
  border-color: #6366f1;
  background: #fff;
}
.login-forgot {
  width: 100%;
  text-align: right;
  margin-bottom: 0.2rem;
}
.forgot-link {
  color: #6366f1;
  font-size: 1rem;
  text-decoration: underline;
  font-weight: 500;
  transition: color 0.2s;
}
.forgot-link:hover {
  color: #3730a3;
}
.login-btn {
  width: 100%;
  padding: 1.1rem;
  background: linear-gradient(90deg, #6366f1 0%, #3730a3 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 1.18rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 0.2rem;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.1);
  transition: background 0.2s;
  letter-spacing: 0.5px;
}
.login-btn:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}
.forgot-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.forgot-content {
  background: #1b1e1b;
  border-radius: 12px;
  padding: 2em 2em 1.5em 2em;
  min-width: 320px;
  box-shadow: 0 8px 32px rgba(55, 48, 163, 0.13);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.close-btn {
  margin-top: 1em;
  background: #eee;
  border: none;
  border-radius: 4px;
  padding: 0.3em 0.7em;
  cursor: pointer;
}
.success-msg {
  color: #16a34a;
  margin-top: 0.5em;
}
.error-msg {
  color: #dc2626;
  margin-top: 0.5em;
}
</style>
