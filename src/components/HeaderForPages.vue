<template>
  <header class="bg-dark text-white p-3 mb-5 shadow-sm">
    <div class="container d-flex justify-content-between align-items-center">
      <h3 class="m-0 fw-bold">Cossack Image Tool</h3>
      <nav class="d-flex flex-row">
        <router-link to="/upload" class="btn btn-outline-light me-2">Upload Form</router-link>
        <router-link to="/all" class="btn btn-outline-light">Public Gallery</router-link>
        <div v-if="username" class="ms-2 align-self-center ">
          <span >
            Hello, {{ username }}
          </span>
        </div>
        <div>
          <a @click="handleLogout">Logout</a>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import api from '@/api/axios';

export default {
  name: 'HeaderForPage',
  data() {
    return {
      username: ''
    };
  },
  methods: {
    async fetchUsername() {
      try {
        const response = await api.get('/user/name');
        if (typeof response.data === 'string' && response.data) {
          this.username = response.data;
        } else if (typeof response.data === 'object' && response.data.username) {
          this.username = response.data.username;
        } else {
          console.warn("Username response format not recognized:", response.data);
        }

      } catch (error) {
        console.error('Failed to fetch username:', error);
      }
    },
    async handleLogout() {
      await api.post('/logout')
      localStorage.removeItem('user-token');
      this.$router.push('/');
    }
  },
  mounted() {
    this.fetchUsername();
  }
}
</script>


<style scoped>

</style>