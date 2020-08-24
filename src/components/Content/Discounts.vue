<template>
  <Loader v-if="loading" />
  <v-row cols="12" v-else-if="!loading && slides.length !== 0">
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <h1 class="font-weight-thin text-center">Акции</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-carousel height="100%" show-arrows-on-hover hide-delimiters>
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
    await this.$store.dispatch('discounts/read')

    this.loading = false
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    slides () {
      return this.$store.getters['discounts/getList'] || []
    }
  }
}
</script>

<style scoped lang="less">
</style>
