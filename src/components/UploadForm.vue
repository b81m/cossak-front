<template>
  <HeaderForPage/>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-11 col-md-8 col-lg-7 col-xl-6">
        <div class="card shadow-sm">
          <div class="card-header text-center fw-bold">Загрузка изображения</div>
          <div class="card-body">
            <form @submit.prevent="onUpload">
              <div class="mb-3">
                <label for="fileInput" class="form-label">Выберите файл</label>
                <input class="form-control" type="file" id="fileInput" @change="onFileSelected" accept="image/*">
              </div>
              <div class="d-flex justify-content-center">
                <button type="submit" class="btn btn-primary px-4" :disabled="!selectedFile || isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {{ isLoading ? ' Загрузка...' : 'Загрузить' }}
                </button>
              </div>
            </form>

            <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>

            <div v-if="imageUrl" class="mt-4 text-center">
              <h3 class="h5 mb-3">Обработанное изображение:</h3>
              <figure class="figure">
                <img :src="imageUrl" class="figure-img img-fluid rounded shadow" alt="Uploaded Image">
                <figcaption v-if="imageName" class="figure-caption text-center">{{ imageName }}</figcaption>
              </figure>
              <blockquote v-if="responseText" class="blockquote mt-3">
                <p>{{ responseText }}</p>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/axios.js';
import HeaderForPage from "@/components/HeaderForPages.vue";

export default {
  components: {HeaderForPage},
  data() {
    return {
      selectedFile: null,
      imageUrl: null,
      imageName: '',
      responseText: '',
      isLoading: false,
      errorMessage: ''
    };
  },
  methods: {
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      this.imageUrl = null;
      this.imageName = '';
      this.responseText = '';
      this.errorMessage = '';
    },
    async onUpload() {
      if (!this.selectedFile) return;

      this.isLoading = true;
      this.errorMessage = '';
      this.imageUrl = null;

      const formData = new FormData();
      formData.append('cossakImage', this.selectedFile);

      try {
        const response = await api.post('/cossak/add', formData);

        const { translatedImage, translatedImageName, fileType, text } = response.data;

        if (translatedImage && fileType) {
          this.imageUrl = `data:${fileType};base64,${translatedImage}`;
          this.imageName = translatedImageName;
          this.responseText = text;
        } else {
          throw new Error("Ответ API не содержит необходимых данных изображения.");
        }

      } catch (error) {
        console.error('Ошибка при загрузке изображения:', error);
        this.errorMessage = 'Не удалось загрузить изображение. Ответ от сервера некорректен.';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
<style scoped>
</style>
