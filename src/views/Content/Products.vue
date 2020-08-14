<template>
  <v-col cols="12">
    <Loader v-if="loading" />
    <v-row v-else>
      <v-col cols="12">
        <v-row justify="center">
          <v-col cols="12">
            <h1 class="font-weight-thin text-center">{{categoryName}}</h1>
          </v-col>
        </v-row>
        <v-row justify="center">
          <ProductCard v-for="product in products" :key="product.id" :product="product"></ProductCard>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import ProductCard from '@/components/app/ProductCard'

export default {
  async mounted () {
    // await this.$store.dis
    await this.$store.dispatch('category/read')
    this.categories = this.$store.getters['category/categories']
    console.log(this.categories)
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
      console.log(this.categories)
      const ans = this.categories.find(category => {
        if (category.id === this.$route.params.id) {
          return category.name
        }
      })
      return ans.name
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
