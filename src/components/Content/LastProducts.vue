<template>
  <Loader v-if="loading" />
  <v-row v-else-if="!loading && products.length !== 0">
    <v-col cols="12">
      <v-row justify="center">
        <v-col cols="12">
          <h1 class="font-weight-thin text-center">Последние товары</h1>
        </v-col>
      </v-row>
      <v-row justify="center">
        <ProductCard v-for="product in products" :key="product.id" :product="product"></ProductCard>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import ProductCard from '@/components/app/ProductCard'
export default {
  async mounted () {
    await this.$store.dispatch('products/read')
    this.products = this.$store.getters['products/lastProducts']
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

<style lang="less">
</style>
