<template>
  <Loader v-if="loading" />
  <List v-else :items="products" :mode="'Продуктов'" />
</template>

<script>
import List from '@/components/Content/List'
export default {
  async mounted () {
    await this.$store.dispatch('products/read')
    this.loading = false
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    products () {
      return this.$store.getters['products/products']
    }
  },
  components: {
    List
  }
}
</script>

<style>
</style>
