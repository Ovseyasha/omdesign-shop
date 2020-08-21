<template>
  <Loader v-if="loading" />
  <v-col v-else xl="10" lg="10" cols="12" class="font-weight-light">
    <v-row>
      <v-col xl="2" lg="2">
        <v-avatar size="150">
          <img :src="user.avatar.url" :alt="user.name" />
        </v-avatar>
      </v-col>
      <v-col xl="7" lg="7" align-self="center">
        <v-row>
          <h1 class="font-weight-light">{{user.name}}</h1>
        </v-row>
        <v-row>
          <h1 class="font-weight-light">{{user.surName}}</h1>
        </v-row>
      </v-col>
      <v-col xl="3" lg="3" align-self="center">
        <v-row>
          <v-btn
            class="font-weight-light"
            router-link
            to="/account/edit"
            tile
            large
            block
            text
          >Редактировать профиль</v-btn>
        </v-row>
        <v-row>
          <v-btn class="font-weight-light" router-link to="/account/review" tile large block text>
            <v-badge color="secondary" :value="reviewsLen" :content="reviewsLen">Отзывы</v-badge>
          </v-btn>
        </v-row>
        <v-row>
          <v-btn class="font-weight-light" router-link to="/account/wishlist" tile large block text>
            <v-badge color="secondary" :content="user.wishList ? user.wishList.length : 0">Избранное</v-badge>
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h1 class="font-weight-light mt-15">
          <v-badge
            color="primary"
            :value="orders ? orders.length : 0"
            :content="orders ? orders.length : 0"
          >Ваши заказы</v-badge>
        </h1>
      </v-col>
    </v-row>
    <v-row v-if="orders.length < 1">
      <v-col cols="12">
        Вы еще ничего не купили у нас. Время это исправить!
        <v-btn tile class="font-weight-light ma-2" color="primary" router-link to="/">Начать покупки</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-row justify="space-between" v-for="(o,index) in orders" :key="index">
          <v-col xl="10" lg="10" md="10" cols="12">
            <v-row>
              <v-col xl="auto" lg="auto" md="auto" cols="12" v-for="p in o.products" :key="p.id">
                <v-card tile>
                  <v-card-title class="font-weight-light">
                    <router-link class="secondary--text" :to="`/products/${p.id}`">{{p.info.name}}</router-link>
                  </v-card-title>
                  <v-card-subtitle class="font-weight-light"></v-card-subtitle>
                  <v-card-text class="font-weight-light">
                    Размер:
                    <span class="secondary--text ml-2">{{p.selectedSize}}</span>
                    <br />Количество:
                    <span class="secondary--text ml-2">{{p.count}}</span>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col xl="2" lg="2" md="2" cols="12">
            <v-row>
              <v-col cols="12">
                <span class="secondary--text">{{o.state}}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                Дата доставки:
                <span class="secondary--text ml-2">{{o.dateDeliv}}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                Время доставки:
                <span class="secondary--text ml-2">{{o.timeDeliv}}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                К оплате:
                <span class="secondary--text ml-2">{{o.total | price}}</span>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  async mounted () {
    await this.$store.dispatch('products/readReviewById')
    await this.$store.dispatch('orders/readByUserId')
    await this.$store.dispatch('users/getInfo')
    await this.$store.dispatch('products/read')
    this.reviewsLen = this.$store.getters['products/myReviews'].length
    this.user = this.$store.getters['users/info']
    const uOr = this.$store.getters['orders/userOrders']
    uOr.forEach(el => {
      el.products.forEach(p => {
        p.info = this.$store.getters['products/productById'](p.id)
      })
    })
    this.orders = uOr
    this.loading = false
  },
  data () {
    return {
      user: {},
      orders: [],
      reviewsLen: null,
      loading: true
    }
  },
  computed: {
  }
}
</script>

<style>
</style>
