<template>
  <Loader v-if="loading" />
  <v-card v-else class="d-inline-block mx-auto product" tile>
    <div v-if="product.isNew" class="isNew">Новинка!</div>
    <v-row justify="center">
      <v-col lg="4">
        <v-carousel class="product__slider" height="auto">
          <v-carousel-item width="auto" v-for="(item,i) in product.photos" :key="i" :src="item.url"></v-carousel-item>
        </v-carousel>
      </v-col>

      <v-col cols="6" class="pl-10">
        <v-row class="flex-column ma-0 fill-height" justify="center">
          <v-col class="px-0">
            <h1 class="text-h2">{{ product.name }}</h1>
            <v-row>
              <v-col cols="6" class="text-center pl-0">
                <span class="product__title text-subtitle-1">Категория:</span>
                <span class="product__value text-subtitle-1">{{product.categoryName | ucFirst}}</span>
              </v-col>
              <v-col cols="6" class="text-center pl-0">
                <span class="product__title text-subtitle-1">Наличие:</span>
                <span class="product__value text-subtitle-1">{{product.status | ucFirst}}</span>
              </v-col>
            </v-row>
          </v-col>

          <v-col class="px-0">
            <v-row class="product__row product__row_price">
              <v-col cols="6" class="text-right">
                <span class="product__title text-subtitle-1">Цена:</span>
                <span class="product__value">
                  <span class="product__price">{{product.price | price}}</span>
                  <span
                    v-if="product.oldPrice"
                    class="product__oldPrice"
                  >{{product.oldPrice | price}}</span>
                </span>
              </v-col>
              <v-col cols="6" class="text-right">
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="px-0" v-if="product.sizes">
            <v-select :items="product.sizes" label="Выберите размер"></v-select>
          </v-col>
          <v-col class="px-0">
            <p
              class="text-subtitle-1 product__desc"
              v-for="(sub,index) in product.desc"
              :key="index"
            >{{sub}}</p>
          </v-col>
          <v-col class="px-0">
            <v-btn large color="secondary" :tile="true">В корзину</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="6">
        <v-badge color="green" :content="product.feedback.length">
          <h1 class="product__feedback-header text-h4">Отзывы покупателей</h1>
        </v-badge>

        <v-row
          class="product__comment"
          v-for="(com,index) in product.feedback"
          :key="index"
          justify="space-between"
        >
          <v-col cols="1">
            <v-avatar>
              <img :src="com.userPhoto" alt="John" />
            </v-avatar>
          </v-col>
          <v-col>
            <v-row justify="space-between">
              <v-col>
                <p>{{com.userName}}</p>
              </v-col>
              <v-col>
                <v-row justify="end">
                  <v-rating v-model="com.score" readonly></v-rating>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <p>{{com.comment}}</p>
            </v-row>
            <v-row justify="space-between">
              <v-col cols="3">
                <v-row justify="space-between">
                  <v-col cols="5">
                    <v-btn icon>
                      <v-icon>mdi-thumb-up</v-icon>
                    </v-btn>
                    <small>{{com.likes}}</small>
                  </v-col>
                  <v-col cols="5">
                    <v-btn icon>
                      <v-icon>mdi-thumb-down-outline</v-icon>
                    </v-btn>
                    <small>{{com.dislikes}}</small>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="3">
                <p>{{com.date}}</p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4" class="ml-5 mt-16">
        <v-row class="mb-5" justify="space-around" align="center">
          <v-rating v-model="summarScore" readonly></v-rating>
          <h1 class="text-h5">{{Math.round(summarScore)}} / 5</h1>
        </v-row>
        <v-row>
          <v-btn x-large block outlined color="secondary" tile>Написать отзыв</v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  async mounted () {
    // Диспатч в стаейт с сервера
    this.product = await this.$store.getters['products/productById'](this.$route.params.id)
    this.loading = false
  },
  data () {
    return {
      loading: true,
      product: {}
    }
  },
  computed: {
    summarScore () {
      const sum = this.product.feedback.reduce((total, item) => {
        return total + item.score
      }, 0)
      const count = this.product.feedback.length

      return sum / count
    }
  }
}
</script>

<style lang="less">
.isNew {
  top: 0;
  width: 15%;
  right: 0;
  position: absolute;
  height: 50px;
  background: #a0c601;
  font-weight: 300;
  font-size: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.product {
  width: 100%;
  height: auto;
  &__desc {
    font-weight: 300 !important;
    line-height: 1.4rem !important;
  }
  &__slider {
    width: 95%;
  }
  // &__row {
  //   // &_price {
  //   // }
  // }
  &__title {
    margin-right: 10px;
    font-weight: bold !important;
  }

  &__value {
    color: #a0c601;
  }
  &__price {
    font-size: 25px !important;
    margin-right: 20px;
  }

  &__oldPrice {
    font-size: 20px !important;
    position: relative;
    &:before {
      border-bottom: 2px solid red;
      position: absolute;
      content: '';
      width: 100%;
      height: 85%;
      transform: rotate(-12deg);
    }
  }
}
</style>
