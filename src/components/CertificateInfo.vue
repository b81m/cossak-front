<template>
  <HeaderForPage/>
  <div class="container mb-5">
    <h1 class="text-center fw-bold mb-4">Информация о грамоте</h1>

    <div v-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>
    <div v-if="!isLoading && !errorMessage">
      <div class="row justify-content-center g-4">
        <div class="col-12 col-lg-6 col-xl-5" v-if="originalImage">
          <div class="card h-100 shadow-sm">
            <div class="card-header text-center fw-bold">Исходное изображение</div>
            <div class="card-body text-center">
              <img
                  :src="createImageUrl(originalImage, fileType)"
                  alt="Исходное изображение"
                  class="certificate-image rounded img-fluid"
              />
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-6 col-xl-5" v-if="translatedImage">
          <div class="card h-100 shadow-sm">
            <div class="card-header text-center fw-bold">Обработанное изображение</div>
            <div class="card-body text-center">
              <img
                  :src="createImageUrl(translatedImage, fileType)"
                  alt="Обработанное изображение"
                  class="certificate-image rounded img-fluid"
              >
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-content-center mt-4" v-if="text">
        <div class="col-12 col-xl-10">
          <div class="card shadow-sm">
            <div class="card-header text-center fw-bold">Распознанный текст</div>
            <div class="card-body">
              <p class="mb-0 text-break">{{ text }}</p>
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
        return 'https://placehold.co/100x100/eee/ccc?text=Нет+изображения';
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
.certificate-image {
  max-height: 560px;
  object-fit: contain;
  width: 100%;
}

</style>
