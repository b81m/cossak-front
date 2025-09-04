<template>
  <HeaderForPage/>
  <div class="container mt-5 mb-5">
    <div class="row">
      <div class="col-12">
        <h1 class="text-center mb-4 fw-bold">Public Cossack Image Gallery</h1>
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-center mb-4">
              <button @click="fetchPublicImages" class="btn btn-primary" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {{ isLoading ? ' Loading...' : 'Fetch Public Images' }}
              </button>
            </div>

            <div v-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>

            <div v-if="!isLoading && images.length === 0 && !errorMessage" class="alert alert-info text-center">
              No public images found. Click the button to fetch records.
            </div>

            <div v-if="images.length > 0" class="table-responsive">
              <table class="table table-striped table-hover align-middle">
                <thead class="table-dark">
                <tr>
                  <th scope="col">Original Image</th>
                  <th scope="col">Original Name</th>
                  <th scope="col">Translated Image</th>
                  <th scope="col">Translated Name</th>
                  <th scope="col">Recognized Text</th>
                  <th scope="col">Creation Date</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(image, index) in images" :key="index">
                  <td>
                    <img :src="createImageUrl(image.originalImage, image.fileType)" alt="Original Image" class="table-image rounded" width="150" height="200">
                  </td>
                  <td>{{ image.originalImageName }}</td>
                  <td>
                    <img :src="createImageUrl(image.translatedImage, image.fileType)" alt="Translated Image" class="table-image rounded " width="150" height="200">
                  </td>
                  <td>{{ image.translatedImageName }}</td>
                  <td>
                    <p class="text-wrap" style="min-width: 200px;">{{ image.text }}</p>
                  </td>
                  <td>{{ image.creationDate }}</td>
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
          throw new Error("Invalid data format received from the server.");
        }

      } catch (error) {
        console.error('Error fetching public images:', error);
        this.errorMessage = (error.response && error.response.data && error.response.data.message)
            ? error.response.data.message
            : 'An unexpected error occurred. Please try again later.';
      } finally {
        this.isLoading = false;
      }
    },

    createImageUrl(base64Data, fileType) {
      if (!base64Data || !fileType) {
        return 'https://placehold.co/100x100/eee/ccc?text=No+Image';
      }
      return `data:${fileType};base64,${base64Data}`;
    }
  },
  mounted() {
    this.fetchPublicImages();
  }
};
</script>


<style scoped>

</style>