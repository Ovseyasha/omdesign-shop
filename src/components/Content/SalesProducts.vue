<template>
  <v-container>
    <v-row justify="space-around">
      <Loader v-if="loading" />
      <ProductCard v-else v-for="product in products" :key="product.id" :product="product"></ProductCard>
    </v-row>
  </v-container>
</template>

<script>
import ProductCard from '@/components/app/ProductCard'
export default {
  async mounted () {
    this.products = await this.$store.getters['products/salesProducts']
    this.loading = false
  },
  data: () => ({
    tile: true,
    loading: true,
    products: []
  }),
  components: {
    ProductCard
  }
}
</script>

<style lang="less" >
</style>
