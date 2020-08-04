<template>
  <div>
    <Loader v-if="loading" />
    <!-- <v-btn @click="create">add Categor</v-btn> -->
  </div>
</template>

<script>
export default {
  mounted () {
    this.loading = false
  },
  data () {
    return {
      loading: true
    }
  },
  methods: {
    async create () {
      // await this.$store.dispatch('category/create', cat)
      this.loading = false
    }
  }
}
</script>

<style>
</style>
