<template>
  <v-app>
    <v-container>
      <Loader v-if="loading" />
      <template v-else>
        <h1 class="main__title">{{categoryName}}</h1>
        <v-row justify="space-around">
          <ProductCard v-for="product in products" :key="product.id" :product="product"></ProductCard>
        </v-row>
      </template>
    </v-container>
  </v-app>
</template>

<script>
import ProductCard from '@/components/app/ProductCard'

export default {
  async mounted () {
    this.categories = await this.$store.getters['category/categories']
    // сделать диспатч всех продукстов с сервера
    this.loading = false
  },
  data () {
    return {
      tile: true,
      loading: true,
      categories: []
    }
  },
  computed: {
    categoryName () {
      return this.categories.find(category => category.id === +this.$route.params.id).name
    },
    products () {
      return this.$store.getters['products/productsByCategory'](this.categoryName)
    }
  },
  components: {
    ProductCard
  }
}
</script>

<style lang="less">
.card {
  &__isNew {
    position: absolute;
    right: 0;
  }
}
.main__title {
  text-align: center;
  font-weight: 200;
  margin-bottom: 20px;
}
</style>
