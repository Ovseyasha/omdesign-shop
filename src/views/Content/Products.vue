<template>
  <v-col xl="10" lg="10" cols="12">
    <Loader v-if="loading" />
    <v-row v-else>
      <v-col cols="12">
        <v-row justify="center">
          <v-col cols="12">
            <h1 class="font-weight-thin text-center">{{categoryName}}</h1>
          </v-col>
        </v-row>
        <v-row justify="end">
          <v-col xl="3" lg="3" cols="12" align="end">
            <v-select
              :value="sortVariants[0]"
              class="font-weight-light"
              :items="sortVariants"
              v-model="sortByPrice"
              label="Сортировка"
            ></v-select>
          </v-col>
        </v-row>
        <v-row justify="center" v-if="items">
          <ProductCard v-for="product in items" :key="product.id" :product="product"></ProductCard>
        </v-row>
        <v-row v-else>
          <v-col cols="12">
            <h1 class="text-h2 mt-15 text-center">Данных товаров нет</h1>
          </v-col>
        </v-row>
        <v-row>
          <Paginate
            v-if="pageCount > 1"
            class
            v-model="page"
            :page-count="pageCount"
            :click-handler="pageChangeHandler"
            :prev-text="'Назад'"
            :next-text="'Далее'"
            :container-class="'v-pagination v-pagination--circle theme--dark '"
            :page-link-class="'v-pagination__navigation v-pagination__item'"
          ></Paginate>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import ProductCard from '@/components/app/ProductCard'
import paginationMixin from '@/mixins/pagination.mixin.js'
export default {
  mixins: [paginationMixin],
  async mounted () {
    await this.$store.dispatch('products/read')
    await this.$store.dispatch('category/read')
    this.categories = this.$store.getters['category/categories']
    this.loading = false
  },
  data () {
    return {
      tile: true,
      loading: true,
      categories: [],
      // filter
      sortByPrice: null,
      sortVariants: ['Новинки', 'Сначала дешевые', 'Сначала дорогие', 'Скидки', 'По рейтингу']
    }
  },
  computed: {
    categoryName () {
      const ans = this.categories.find(category => {
        if (category.id === this.$route.params.id) {
          return category.name
        }
      })
      let prod = this.$store.getters['products/productsByCategory'](ans.name)
      switch (this.sortByPrice) {
        case 'Сначала дешевые':
          prod.sort((a, b) => {
            if (+a.price > +b.price) {
              return 1
            }
            if (+a.price < +b.price) {
              return -1
            }
            return 0
          })
          break
        case 'Сначала дорогие':
          prod.sort((a, b) => {
            if (+a.price < +b.price) {
              return 1
            }
            if (+a.price > +b.price) {
              return -1
            }
            return 0
          })
          break
        case 'Новинки':
          prod = prod.filter(p => p.isNew === true)
          break
        case 'Скидки':
          prod = prod.filter(p => p.oldPrice !== false)
          break
        case 'По рейтингу':
          prod = prod.filter(p => p.feedback)
          prod.sort((a, b) => {
            let scoreA = null
            let scoreB = null
            const sum = Object.values(a.feedback).reduce((total, item) => {
              return total + item.score
            }, 0)
            const count = Object.values(a.feedback).length
            scoreA = sum / count
            const sumb = Object.values(b.feedback).reduce((total, item) => {
              return total + item.score
            }, 0)
            const countb = Object.values(b.feedback).length
            scoreB = sumb / countb
            if (scoreA < scoreB) {
              return 1
            }
            if (scoreA > scoreB) {
              return -1
            }
            return 0
          })
          break
      }
      this.setupPagination(prod)
      return ans.name
    }
  },
  methods: {
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
.v-pagination__item {
  outline: none;
}
.active {
  a {
    background-color: #4d6a00 !important;
  }
}
</style>
