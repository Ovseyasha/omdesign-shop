<template>
  <Loader v-if="loading" />
  <v-col cols="12" v-else>
    <div v-if="product.isNew" class="isNew px-5">Новинка!</div>
    <v-row justify="center">
      <v-col xl="4" lg="4" md="5" sm="12" cols="12">
        <v-carousel height="auto">
          <v-carousel-item v-for="(item,i) in product.photos" :key="i" :src="item.img"></v-carousel-item>
        </v-carousel>
      </v-col>

      <v-col xl="6" lg="6" md="6" sm="12" cols="12" class="font-weight-light">
        <v-row>
          <v-col cols="12">
            <h1 class="text-h2 font-weight-light">{{ product.name }}</h1>
          </v-col>
        </v-row>
        <v-row justify="space-between" class="mb-5">
          <v-col xl="6" lg="6" cols="12" align-self="center">
            <span class="text-h5 font-weight-light">Категория:</span>
            <span
              class="text-h5 font-weight-light secondary--text ml-2"
            >{{product.category | ucFirst}}</span>
          </v-col>
          <v-col xl="6" lg="6" cols="12" align-self="center">
            <span class="text-h5 font-weight-light">Наличие:</span>
            <span
              class="text-h5 font-weight-light secondary--text ml-2"
            >{{product.status | ucFirst}}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col xl="3" lg="3" cols="12" align-self="center">
            <span class="text-h5 font-weight-light">Цена:</span>
            <span class="ml-2 text-h5 font-weight-light secondary--text">
              <span class>{{product.price | price}}</span>
              <span v-if="product.oldPrice" class="product__oldPrice">{{product.oldPrice | price}}</span>
            </span>
          </v-col>
          <v-col xl="6" lg="6" cols="10" offset-xl="2" offset-lg="2">
            <BtnForCart :id="product.id" :selectedSize="selectedSize" />
          </v-col>
          <v-col xl="1" lg="1" cols="2" align-self="center">
            <WishListAdder :id="product.id" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" v-if="product.sizes">
            <v-select
              v-if="changeSized"
              label="Измените размер"
              :items="product.sizes"
              :value="changeSized"
              @change="changeSize(product.id, $event)"
            ></v-select>
            <v-select v-else :items="product.sizes" v-model="selectedSize" label="Выберите размер"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <p
              class="text-subtitle-1 font-weight-light"
              v-for="(sub,index) in product.desc"
              :key="index"
            >{{sub}}</p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-10">
      <v-col xl="10" lg="10" md="11" cols="12">
        <v-row>
          <v-col xl="6" lg="6" cols="12">
            <v-badge
              color="green"
              :content="countReview"
              :value="countReview"
              v-if="product.feedback"
            >
              <h1 class="product__feedback-header font-weight-light text-h4">Отзывы покупателей</h1>
            </v-badge>
            <h2
              v-else
              class="text-h4 mt-15 font-weight-light"
            >Отзывов ещё нет — ваш может стать первым!</h2>
          </v-col>
          <v-col xl="6" lg="6" cols="12">
            <v-row class="mb-5" justify="space-around" align="center">
              <v-col cols="6" align="right">
                <v-rating v-model="summarScore" readonly></v-rating>
              </v-col>
              <v-col cols="6" align="center">
                <h1 class="text-h5">{{Math.round(summarScore)}} / 5</h1>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-btn
                  x-large
                  block
                  outlined
                  color="secondary"
                  @click="openDialog()"
                  tile
                >Написать отзыв</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row
          class="product__comment"
          v-for="(com,index) in product.feedback"
          :key="index"
          justify="space-between"
        >
          <v-col cols="12">
            <v-row justify="space-between">
              <v-col cols="1" align="center">
                <v-avatar>
                  <img :src="com.userAvatar" :alt="com.userName" />
                </v-avatar>
              </v-col>
              <v-col align-self="center" offset-xl="0" offset-lg="0" offset="1">
                <p>{{com.userName}} {{com.userSurName}}</p>
              </v-col>
              <v-col>
                <v-row justify="end">
                  <v-rating v-model="com.score" readonly></v-rating>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <p>{{com.comment}}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                xl="1"
                lg="1"
                cols="4"
                align-self="end"
                v-for="(pic,index) in com.photos"
                :key="index"
              >
                <v-img
                  :src="pic.img"
                  max-height="200px"
                  style="cursor: pointer"
                  @click="openPhotoView(pic.img)"
                ></v-img>
              </v-col>
              <v-dialog tile v-model="photoView" max-width="500">
                <v-card tile>
                  <v-col cols="12">
                    <v-row justify="end">
                      <v-btn icon @click="photoView = false" class="mr-2">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-row>
                  </v-col>
                  <v-img :src="url"></v-img>
                </v-card>
              </v-dialog>
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
                    <small>{{com.disLikes}}</small>
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
    </v-row>
    <v-dialog v-model="reviewWindow" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card tile class="font-weight-light">
        <v-toolbar fixed dark color="primary">
          <v-btn icon dark @click="reviewWindow = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Ваш отзыв</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text tile class="font-weight-light" @click="sendReview">Отправить</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-actions>
          <v-col cols="12">
            <v-row justify="center">
              <v-col xl="8" lg="8" cols="12">
                <v-row>
                  <v-col cols="12" align="center">
                    <h2 class="font-weight-light text-center">Оцените покупку</h2>
                    <v-rating class="mt-5" v-model="review.score"></v-rating>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      label="Описание товара"
                      hint="Поделитесь впечатлениями о товаре"
                      counter="540"
                      v-model="review.comment"
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-row>
                  <SlideEditor :slides="review.photos" @changed="slideChange" />
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog tile v-model="entryDialog" max-width="390">
      <v-card>
        <v-card-text>
          <h2
            class="font-weight-light pt-10"
          >Только зарегистрированные пользователи могут оставлять отзывы.</h2>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn tile text @click="entryDialog = false">Отмена</v-btn>
          <router-link to="/login">
            <v-btn tile color="primary" text>Войти</v-btn>
          </router-link>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
import BtnForCart from '@/components/app/BtnForCart'
import WishListAdder from '@/components/app/WishListAdder'
import SlideEditor from '@/components/app/SlideEditor'
export default {
  async mounted () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    // Диспатч в стаейт с сервера
    this.isLogin = this.$store.getters['users/getUid'] !== null
    await this.$store.dispatch('products/read')
    await this.$store.dispatch('cart/loadCart', this.isLogin)
    const productInCart = this.$store.getters['cart/products']
    productInCart.find(p => {
      if (p.id === this.$route.params.id) {
        this.changeSized = p.selectedSize
      }
    })
    this.loading = false
  },
  data () {
    return {
      loading: true,
      selectedSize: null,
      changeSized: null,
      isLogin: '',
      reviewWindow: false,
      entryDialog: false,
      photoView: false,
      url: null,
      review: {
        score: 0,
        comment: '',
        photos: null
      }
    }
  },
  computed: {
    summarScore () {
      let answer = 0
      if (this.product.feedback) {
        const sum = Object.values(this.product.feedback).reduce((total, item) => {
          return total + item.score
        }, 0)
        console.log(sum)
        const count = this.countReview
        answer = sum / count
      }
      return answer
    },
    countReview () {
      return Object.keys(this.product.feedback).length
    },
    product () {
      return this.$store.getters['products/productById'](this.$route.params.id)
    }
  },
  methods: {
    openPhotoView (src) {
      this.url = src
      this.photoView = true
    },
    async changeSize (id, v) {
      try {
        await this.$store.dispatch('cart/changeSize', {
          id,
          v,
          isLogin: this.isLogin
        })
      } catch (error) {
        console.log(error)
      }
    },
    openDialog () {
      if (this.isLogin) {
        this.reviewWindow = true
      } else {
        this.entryDialog = true
      }
    },
    slideChange (v, d) {
      this.review.photos = v
    },
    async sendReview () {
      try {
        this.loading = true
        if (this.review.photos) {
          this.review.photos.forEach(el => {
            delete el.url
          })
        }
        await this.$store.dispatch('products/createReview', {
          id: this.product.id,
          review: this.review
        })
        await this.$store.dispatch('products/read')
        this.review = {}
        this.loading = false
        this.reviewWindow = false
      } catch (error) {
        console.log(error)
      }
    }
  },
  components: {
    BtnForCart,
    WishListAdder,
    SlideEditor
  }
}
</script>

<style lang="less">
.isNew {
  z-index: 1;
  top: 0;
  // width: 15%;
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
    width: 100%;
  }
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
