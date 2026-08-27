<template>
  <header class="app-header mb-5 shadow-sm">
    <div class="container header-content">
      <h3 class="m-0 fw-bold">Расшифровка казачьих грамот</h3>

      <nav class="header-nav">
        <router-link to="/upload" class="btn btn-outline-light">Загрузка</router-link>
        <router-link to="/all" class="btn btn-outline-light">Галерея</router-link>

        <div v-if="username" class="user-info">
          <span class="user-label">Пользователь</span>
          <span class="user-name">{{ username }}</span>
        </div>

        <button type="button" class="btn btn-light logout-button" @click="handleLogout">
          Выйти
        </button>
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
        const response = await api.get('/username');
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
      try {
        await api.post('/logout');
      } catch (error) {
        console.error('Не удалось выполнить выход на сервере:', error);
      } finally {
        localStorage.removeItem('user-token');
        this.$router.push('/');
      }
    }
  },
  mounted() {
    this.fetchUsername();
  }
}
</script>


<style scoped>
.app-header {
  background: #1f2937;
  color: #fff;
  padding: 18px 0;
}

.header-content {
  align-items: center;
  display: flex;
  gap: 24px;
  justify-content: space-between;
}

.header-nav {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

.user-info {
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  display: flex;
  gap: 8px;
  min-height: 38px;
  padding: 6px 12px;
}

.user-label {
  color: #cbd5e1;
  font-size: 13px;
}

.user-name {
  font-weight: 700;
}

.logout-button {
  color: #1f2937;
  font-weight: 700;
  min-width: 90px;
}

@media (max-width: 768px) {
  .header-content {
    align-items: stretch;
    flex-direction: column;
  }

  .header-nav {
    justify-content: flex-start;
  }
}

</style>
