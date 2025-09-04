<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg p-4">
          <div class="card-body">
            <h2 class="card-title text-center fw-bold mb-4">{{ isLogin ? 'Login' : 'Register' }}</h2>
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="username" class="form-label fw-bold">Username</label>
                <input type="text" v-model="form.username" id="username" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label fw-bold">Password</label>
                <input type="password" v-model="form.password" id="password" class="form-control" required>
              </div>
              <div class="d-flex justify-content-center">
                <div class="mb-3">
                  <button type="submit" class="btn btn-primary">
                    {{ isLogin ? 'Sign In' : 'Sign Up' }}
                  </button>
                </div>
              </div>
              <div class="d-flex justify-content-center">
                <div class="mb-3">
                  <a @click="toggleForm" class="btn-link" style="cursor: pointer;">
                    {{ isLogin ? 'Need an account?' : 'Have an account?' }}
                  </a>
                </div>
              </div>
              <div v-if="message" class="mt-4 text-center fw-bold" :class="isError ? 'text-danger' : 'text-success'">
                {{ message }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios';

export default {
  data() {
    return {
      isLogin: true,
      form: {
        username: '',
        password: ''
      },
      message: '',
      isError: false
    };
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin;
      this.message = '';
      this.form.username = '';
      this.form.password = '';
    },
    async handleSubmit() {
      const endpoint = this.isLogin ? '/login' : '/register';
      try {
        const response = await api.post(endpoint, this.form);
        this.isError = false;

        if (this.isLogin) {
          const token = response.data.token;
          if (token) {
            localStorage.setItem('user-token', token);
            this.message = 'Login successful! Redirecting...';
            console.log(token);
            this.$router.push('/upload');
          } else {
            this.message = response.data.message || 'Login successful, but no token received.';
          }
        } else {
          this.message = response.data;
        }

      } catch (error) {
        this.message = error.response && error.response.data ? (error.response.data.message || error.response.data) : 'An error occurred';
        console.log(error);
        this.isError = true;
      }
    }
  }
};
</script>

<style scoped>

</style>