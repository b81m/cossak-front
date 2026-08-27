<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-lg p-4">
          <div class="card-body">
            <h2 class="card-title text-center fw-bold mb-4">{{ isLogin ? 'Вход' : 'Регистрация' }}</h2>
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="username" class="form-label fw-bold">Имя пользователя</label>
                <input type="text" v-model="form.username" id="username" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label fw-bold">Пароль</label>
                <input type="password" v-model="form.password" id="password" class="form-control" required>
              </div>
              <div class="d-flex justify-content-center">
                <div class="mb-3">
                  <button type="submit" class="btn btn-primary">
                    {{ isLogin ? 'Войти' : 'Зарегистрироваться' }}
                  </button>
                </div>
              </div>
              <div class="d-flex justify-content-center">
                <div class="mb-3">
                  <button type="button" class="btn btn-outline-secondary" @click="toggleForm">
                    {{ isLogin ? 'Создать аккаунт' : 'Перейти ко входу' }}
                  </button>
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
      if (this.isLogin) {
        localStorage.removeItem('user-token');
      }

      try {
        const response = await api.post(endpoint, this.form);
        this.isError = false;

        if (this.isLogin) {
          const token = response.data.token;
          if (token) {
            localStorage.setItem('user-token', token);
            this.message = 'Вход выполнен успешно. Выполняется переход...';
            this.$router.push('/upload');
          } else {
            this.message = response.data.message || 'Вход выполнен, но токен не был получен.';
          }
        } else {
          this.message = 'Регистрация выполнена успешно.';
        }

      } catch (error) {
        const status = error.response && error.response.status;

        if (this.isLogin && [401, 403].includes(status)) {
          localStorage.removeItem('user-token');
          this.message = 'Неверное имя пользователя или пароль.';
        } else {
          this.message = this.isLogin
              ? 'Не удалось выполнить вход. Попробуйте позже.'
              : 'Не удалось выполнить регистрацию. Попробуйте позже.';
        }
        console.log(error);
        this.isError = true;
      }
    }
  }
};
</script>
<style scoped>
</style>
