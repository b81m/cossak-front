<template>
  <HeaderForPage/>
  <div class="page-container">
    <div v-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>
    <div v-if="!isLoading && !errorMessage">
      <div class="container">
        <div class="d-flex flex-row justify-content-center">
          <div class="cards-wrapper">
            <div class="d-flex flex-row align-items-center">
              <div class="card p-2 rounded" v-if="originalImage">
                <div class="d-flex justify-content-center">
                  <h2 class="image-label">Original Image</h2>
                </div>
                <img :src="createImageUrl(originalImage, fileType)" alt="Original Image" class="table-image rounded"
                     width="300" height="400"/>
              </div>
              <div class="card ms-3 p-2 rounded" v-if="translatedImage">
                <div class="d-flex justify-content-center">
                  <h2 class="image-label">Translated Image</h2>
                </div>
                <img :src="createImageUrl(translatedImage, fileType)" alt="Translated Image" class="table-image rounded"
                     width="300" height="400">
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex flex-row justify-content-center mt-3">
          <div class="card text-content-card p-3" v-if="text">
            <div class="card-content">
              <h3>Recognized Text</h3>
              <p>{{ text }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import HeaderForPage from "@/components/HeaderForPages.vue";
import api from "@/api/axios";

export default {
  name: "CertificateInfo",
  components: {HeaderForPage},

  data() {
    return {
      originalImage: '',
      translatedImage: '',
      text: '',
      fileType: '',
      errorMessage: '',
      isLoading: false,
    }
  },

  methods: {
    async fetchCossakInfo() {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const imageId = this.$route.params.imageId;
        const response = await api.get(`/cossak/${imageId}`);

        console.log("API Response Data:", response.data.id);

        this.originalImage = response.data.originalImage;
        this.translatedImage = response.data.translatedImage;
        this.fileType = response.data.fileType;
        this.text = response.data.text;
      } catch (error) {
        console.error('Ошибка при загрузке изображения:', error);
        this.errorMessage = 'Не удалось загрузить изображение. Ответ от сервера некорректен.';
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
  },

  mounted() {
    this.fetchCossakInfo()
  }
}
</script>

<style scoped>

</style>