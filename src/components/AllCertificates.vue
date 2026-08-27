<template>
  <HeaderForPage/>
  <div class="container mt-5 mb-5">
    <div class="row">
      <div class="col-12">
        <h1 class="text-center mb-4 fw-bold">Галерея загруженных грамот</h1>
        <div class="card shadow-sm">
          <div class="card-body">
            <div v-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>
            <div v-if="!isLoading && images.length === 0 && !errorMessage" class="alert alert-info text-center">
              Загруженные грамоты не найдены.
            </div>
            <div v-if="images.length > 0" class="table-responsive">
              <table class="table table-striped table-hover align-middle">
                <thead class="table-dark">
                <tr>
                  <th scope="col" class="text-center">Исходное изображение</th>
                  <th scope="col" class="text-center">Обработанное изображение</th>
                  <th scope="col" class="text-center">Распознанный текст</th>
                  <th scope="col" class="text-center text-nowrap">Дата создания</th>
                  <th scope="col" class="text-center">Действия</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(image, index) in images" :key="index">
                  <td>
                    <img :src="createImageUrl(image.originalImage, image.fileType)" alt="Исходное изображение" class="table-image rounded" width="150" height="200">
                  </td>
                  <td>
                    <img :src="createImageUrl(image.translatedImage, image.fileType)" alt="Обработанное изображение" class="table-image rounded " width="150" height="200">
                  </td>
                  <td>
                    <p class="text-wrap" style="min-width: 200px;">{{ image.text }}</p>
                  </td>
                  <td class="text-nowrap">{{ image.creationDate }}</td>
                  <td>
                    <div class="d-flex flex-column align-items-center gap-2">
                      <button @click="openImageDetails(image.id)" class="btn btn-outline-info btn-sm w-100">
                        Открыть
                      </button>
                      <button @click="deleteImage(image.id)" class="btn btn-outline-danger btn-sm w-100">
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import api from '../api/axios';
import HeaderForPage from "@/components/HeaderForPages.vue";
export default {
  name: 'PublicImages',
  components: {HeaderForPage},
  data() {
    return {
      images: [],
      isLoading: false,
      errorMessage: ''
    };
  },
  methods: {
    async fetchPublicImages() {
      this.isLoading = true;
      this.errorMessage = '';
      this.images = [];

      try {
        const response = await api.get('/cossak/all');

        if (response.data && Array.isArray(response.data)) {
          this.images = response.data;
        } else {
          throw new Error("Сервер вернул некорректный формат данных.");
        }

      } catch (error) {
        console.error('Ошибка при загрузке грамот:', error);
        this.errorMessage = (error.response && error.response.data && error.response.data.message)
            ? error.response.data.message
            : 'Не удалось загрузить список грамот. Попробуйте позже.';
      } finally {
        this.isLoading = false;
      }
    },

    createImageUrl(base64Data, fileType) {
      if (!base64Data || !fileType) {
        return 'https://placehold.co/100x100/eee/ccc?text=No+Image';
      }
      return `data:${fileType};base64,${base64Data}`;
    },
    openImageDetails(imageId) {
      this.$router.push({ name: `CertificateInfo`, path: '/cossak/:imageId', params: { imageId } });
    },
    async deleteImage(imageId) {
      if(!confirm('Вы уверены, что хотите удалить эту грамоту?')) {
        return;
      }

      this.errorMessage = '';

      await api.delete(`/cossak/${imageId}`);

      this.images = this.images.filter(image => image.id !== imageId);
    }
  },
  mounted() {
    this.fetchPublicImages();
  }
};
</script>
<style scoped>
</style>
