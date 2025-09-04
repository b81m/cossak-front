<template>
  <header class="bg-dark text-white p-3 mb-5 shadow-sm">
    <div class="container d-flex justify-content-between align-items-center">
      <h3 class="m-0 fw-bold">Cossack Image Tool</h3>
      <nav>
        <router-link to="/upload" class="btn btn-outline-light me-2">Upload Form</router-link>
        <router-link to="/all" class="btn btn-outline-light">Public Gallery</router-link>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderForPage',
}
</script>


<style scoped>

</style>