<template>
  <Loader v-if="loading" />
  <v-col v-else xl="10" lg="10" md="10" cols="12" class="font-weight-light">
    <v-row>
      <v-col cols="12">
        <v-btn icon color="secondary" x-large router-link to="/account">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <h1 class="ml-2 mb-15 font-weight-thin">Избранные товары</h1>
      </v-col>
    </v-row>
    <v-row justify="center" v-if="products.length">
      <ProductCard v-for="product in products" :key="product.id" :product="product"></ProductCard>
    </v-row>
    <v-row v-else justify="center">
      <h2 class="font-weight-light">Список пуст</h2>
    </v-row>
  </v-col>
</template>

<script>
import ProductCard from '@/components/app/ProductCard'

export default {
  async mounted () {
    await this.$store.dispatch('users/getInfo')
    await this.$store.dispatch('products/read')
    const user = this.$store.getters['users/info']
    if (user.wishList) {
      user.wishList.forEach(id => {
        this.products.push(this.$store.getters['products/productById'](id))
      })
    }
    this.loading = false
  },
  data () {
    return {
      loading: true,
      products: []
    }
  },
  components: {
    ProductCard
  }
}
</script>

<style>
</style>
