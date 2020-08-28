<template>
  <Loader v-if="loading" />
  <v-col xl="10" lg="10" cols="12" v-else>
    <v-row>
      <v-col cols="12" align="center" class="pb-0" v-if="products.length !== 0">
        <h1 class="font-weight-light">Корзина</h1>
      </v-col>
    </v-row>
    <v-row v-if="products.length === 0">
      <v-col cols="12">
        <h2 class="text-center mb-2 font-weight-light">Корзина пуста</h2>
        <router-link to="/">
          <v-btn x-large block color="primary" class="font-weight-light" tile>Перейти к покупкам</v-btn>
        </router-link>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-row v-for="product in products" :key="product.id" class="font-weight-light">
          <v-col cols="12">
            <v-row justify="space-between" align="center">
              <v-col xl="2" lg="2" md="12" sm="12" cols="12" align="center">
                <router-link :to="`/products/${product.id}`">
                  <v-img :src="product.photos[0].img" max-width="500px" class="mb-5"></v-img>
                </router-link>
              </v-col>
              <v-col xl="2" lg="2" md="12" sm="12" cols="12">
                <router-link :to="`/products/${product.id}`" class="cart__color">
                  <h2 class="font-weight-light">{{product.name}}</h2>
                </router-link>

                <p>{{product.category.name | ucFirst}}</p>
              </v-col>
              <v-col xl="1" lg="1" md="12" sm="12" cols="12" align="center">
                <template v-if="product.sizes">
                  <v-select
                    v-if="product.selectedSize"
                    ref="select1"
                    :items="product.sizes"
                    :value="product.selectedSize"
                    @change="changeSize(product.id, $event)"
                    label="Размер"
                  ></v-select>
                  <v-select
                    v-else
                    ref="select2"
                    :items="product.sizes"
                    @change="changeSize(product.id, $event)"
                    label="Размер"
                  ></v-select>
                </template>
              </v-col>
              <v-col
                xl="2"
                lg="2"
                md="12"
                sm="12"
                cols="12"
                class="text-h5 font-weight-light"
                align="center"
              >{{ product.price | price}}</v-col>
              <v-col xl="2" lg="2" md="12" sm="12" cols="12" align="center">
                <v-btn x-large color="secondary" @click="addCount(product.id, product.count)" icon>
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <span class="mx-5 text-subtitle-1 font-weight-light">{{product.count }}</span>
                <v-btn
                  x-large
                  color="secondary"
                  @click="minusCount(product.id, product.count)"
                  icon
                  :disabled="product.count === 1"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </v-col>
              <v-col
                xl="2"
                lg="2"
                md="12"
                sm="12"
                cols="12"
                class="text-h5 font-weight-light secondary--text"
                align="center"
              >{{ product.price * product.count | price }}</v-col>
              <v-col xl="1" lg="1" md="12" sm="12" cols="12" class="mx-auto" align="center">
                <v-btn icon @click="deleteProduct(product.id)" x-large>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-divider></v-divider>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="end" class="mr-5" v-if="products.length !== 0">
      <v-col cols="auto">
        <p class="text-h4 font-weight-bold">ИТОГ:</p>
      </v-col>
      <v-col cols="auto">
        <h1 class="text-h4 font-weight-light secondary--text">{{total | price}}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn
          @click="checkout"
          block
          tile
          x-large
          class="font-weight-light"
          v-if="products.length !== 0"
        >Продолжить оформление</v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  async mounted () {
    await this.$store.dispatch('products/read')
    await this.$store.dispatch('cart/loadCart', this.isLogin)
    this.loading = false
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    products () {
      const prod = []
      for (const i of this.$store.getters['cart/products']) {
        prod.push({
          ...this.$store.getters['products/productById'](i.id),
          count: i.count,
          selectedSize: i.selectedSize
        })
      }
      return prod
    },
    total () {
      return this.products.reduce((total, product) => total + product.count * product.price, 0)
    },
    isLogin () {
      return this.$store.getters['users/getUid'] !== null
    }
  },
  methods: {
    async changeSize (id, v) {
      try {
        await this.$store.dispatch('cart/changeSize', {
          id,
          v,
          isLogin: this.isLogin
        })
      } catch (error) {

      }
    },
    async addCount (id, count) {
      try {
        await this.$store.dispatch('cart/changeCount', {
          id: id,
          count: ++count,
          isLogin: this.isLogin
        })
      } catch (error) {
      }
    },
    async minusCount (id, count) {
      try {
        await this.$store.dispatch('cart/changeCount', {
          id: id,
          count: --count,
          isLogin: this.isLogin
        })
      } catch (error) {
      }
    },
    async deleteProduct (id) {
      try {
        await this.$store.dispatch('cart/delete', {
          id: id,
          isLogin: this.isLogin
        })
      } catch (error) {
      }
    },
    async checkout () {
      try {
        await this.$store.commit('cart/total', this.total)
        this.$router.push('/checkout')
      } catch (error) {
      }
    }
  },
  metaInfo () {
    return {
      title: '| ' + 'КОРЗИНА'
    }
  }
}
</script>

<style lang="less">
.cart {
  width: 90%;
  &__color {
    color: #a0c601 !important;
  }
  &__text {
    font-size: 2em;
    font-weight: 300;
  }
}
</style>
