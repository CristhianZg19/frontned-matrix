<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Login</h1>
    <form @submit.prevent="login" class="mx-auto col-4">
      <div class="mb-3">
        <input
          v-model="username"
          class="form-control"
          placeholder="Username"
          required
        />
      </div>
      <div class="mb-3">
        <input
          v-model="password"
          type="password"
          class="form-control"
          placeholder="Password"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary w-100">Login</button>
    </form>
    <div
      v-if="alert.show"
      class="alert alert-danger alert-dismissible fade show mt-2 mx-auto col-4"
      role="alert"
    >
      {{ alert.message }}
      <button
        type="button"
        class="btn-close"
        @click="alert.show = false"
        aria-label="Close"
      ></button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginPage",

  data() {
    return {
      username: "",
      password: "",
      alert: {
        show: false,
        message: "",
      },
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post("http://localhost:3001/login", {
          username: this.username,
          password: this.password,
        });
        localStorage.setItem("token", response.data.token);
        this.$router.push("/");
      } catch (error) {
        console.error(error);
        // Verifica si `error.response` y `error.response.data.error` existen
        const errorMessage =
          error.response?.data?.error || "An unknown error occurred";

        // Llama a `showAlert` solo si `errorMessage` tiene un valor
        if (errorMessage) {
          this.showAlert(errorMessage);
        }
      }
    },
    showAlert(message) {
      this.alert.message = message;
      this.alert.show = true;
    },
  },
};
</script>

