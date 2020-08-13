<template>
  <Loader v-if="loading" />
  <v-card v-else tile height="auto" class="cart">
    <v-card-text>
      <v-card-subtitle class="cart__text" v-if="products.length === 0">
        Корзина пуста
        <router-link to="/">
          <v-btn color="primary" tile>Перейти к покупкам</v-btn>
        </router-link>
      </v-card-subtitle>

      <!-- <v-simple-table v-else>
        <template>
          <tbody>
            <tr v-for="product in products" :key="product.id" class="cart__col font-weight-light">
              <td>
                <router-link :to="`/product/${product.id}`">
                  <v-img :src="product.photos[0].img" width="150px" class="mb-5 mt-5"></v-img>
                </router-link>
              </td>
              <td>
                <router-link :to="`/product/${product.id}`" class="cart__color">
                  <h1 class="font-weight-light">{{product.name}}</h1>
                </router-link>

                <p>{{product.category | ucFirst}}</p>
              </td>
              <td>
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
              </td>
              <td class="text-h5 font-weight-light">{{ product.price | price}}</td>
              <td>
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
              </td>
              <td
                class="text-h5 font-weight-light secondary--text"
              >{{ product.price * product.count | price }}</td>
              <td>
                <v-btn icon @click="deleteProduct(product.id)" x-large>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>-->
      <v-row v-else>
        <v-col>
          <v-row
            justify="space-between"
            align="center"
            v-for="product in products"
            :key="product.id"
            class="font-weight-light"
          >
            <v-col xl="2" lg="2" md="12" sm="12" cols="12" align="center">
              <router-link :to="`/product/${product.id}`">
                <v-img :src="product.photos[0].img" max-width="500px" class="mb-5 mt-5"></v-img>
              </router-link>
            </v-col>
            <v-col xl="2" lg="2" md="12" sm="12" cols="12">
              <router-link :to="`/product/${product.id}`" class="cart__color">
                <h1 class="font-weight-light">{{product.name}}</h1>
              </router-link>

              <p>{{product.category | ucFirst}}</p>
            </v-col>
            <v-col xl="1" lg="1" md="12" sm="12" cols="12" align="center">
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
        </v-col>
      </v-row>
      <v-row justify="end" class="mr-5 mt-5" v-if="products.length !== 0">
        <p class="text-right text-h4 font-weight-bold">ИТОГ:</p>
        <h1 class="text-h4 font-weight-light secondary--text ml-5">{{total | price}}</h1>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn
        @click="checkout"
        block
        x-large
        class="font-weight-light"
        v-if="products.length !== 0"
      >Оформить заказ</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  mounted () {
  },
  data () {
    return {
      loading: false
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
        console.log(error)
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
        console.log(error)
      }
    },
    async deleteProduct (id) {
      try {
        await this.$store.dispatch('cart/delete', {
          id: id,
          isLogin: this.isLogin
        })
      } catch (error) {
        console.log(error)
      }
    },
    async checkout () {
      console.log(this.$store.getters['cart/products'], this.total)
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
