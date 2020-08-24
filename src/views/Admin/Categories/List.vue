<template>
  <Loader v-if="loading" />
  <List v-else :items="categories" :mode="'Категорий'" />
</template>

<script>
import List from '@/components/Content/List'
export default {
  async mounted () {
    await this.$store.dispatch('category/read')
    this.loading = false
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    categories () {
      return this.$store.getters['category/categories']
    }
  },
  components: {
    List
  }
}
</script>

<style>
</style>
