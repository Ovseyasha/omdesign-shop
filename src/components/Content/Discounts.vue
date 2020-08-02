<template>
  <Loader v-if="loading" />
  <v-carousel v-else class="carousel" cycle height="400" show-arrows-on-hover>
    <v-carousel-item v-for="(slide, i) in slides" :key="i" :src="slide.url"></v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  async mounted () {
    // dispatch from server
    this.slides = await this.$store.getters['discounts/getList']
    this.loading = false
  },
  data () {
    return {
      loading: true,
      slides: []
    }
  }
}
</script>

<style lang="less">
</style>
