<template>
  <Loader v-if="loading" />
  <v-row cols="12" v-else>
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <h1 class="font-weight-thin text-center">Акции</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-carousel height="auto" show-arrows-on-hover hide-delimiters>
          <v-carousel-item v-for="(slide, i) in slides" :key="i" :src="slide.url"></v-carousel-item>
        </v-carousel>
      </v-row>
    </v-col>
  </v-row>
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

<style scoped lang="less">
</style>
