<template>
  <v-card width="350" tile>
    <img v-if="product.isNew" class="card__isNew" :src="require('@/assets/new.png')" alt="is new" />
    <v-list-item>
      <v-list-item-content>
        <router-link class="card__name" :to="`/product/${product.id}`">
          <v-list-item-title class="headline">{{product.name}}</v-list-item-title>
        </router-link>
        <v-list-item-subtitle>{{product.categoryName | ucFirst}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <router-link :to="`/product/${product.id}`">
      <v-img :src="product.photos[0].url" height="400"></v-img>
    </router-link>

    <v-card-text class="card__prices">
      <h1 class="card__newPrice">{{ product.price | price }}</h1>
      <h2 class="card__oldPrice" v-if="product.oldPrice">{{product.oldPrice | price }}</h2>
    </v-card-text>

    <v-card-actions>
      <BtnForCart :id="product.id" />
      <router-link class="card__more" :to="`/product/${product.id}`">
        <v-btn text color="primary" tile>Подробнее</v-btn>
      </router-link>
      <v-spacer></v-spacer>
      <v-btn icon @click="addToWishList">
        <v-icon :color="color">mdi-heart</v-icon>
      </v-btn>
    </v-card-actions>
    <v-dialog v-model="dialog" persistent max-width="490">
      <v-card>
        <v-card-text class="text-h5 pt-15">Что бы добавить продукт в Избранное, войдите в систему</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">Отмена</v-btn>
          <router-link to="/login">
            <v-btn color="secondary" text @click="dialog = false">Войти</v-btn>
          </router-link>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import BtnForCart from '@/components/app/BtnForCart'
export default {
  async mounted () {
    await this.$store.dispatch('users/getInfo')
    const wishList = this.$store.getters['users/info'].wishList
    if (wishList) {
      wishList.find((id) => {
        if (id === this.product.id) {
          this.color = 'error'
        }
      })
    }
  },
  props: ['product'],
  data () {
    return {
      dialog: false,
      color: ''
    }
  },
  methods: {
    async addToWishList () {
      const user = await this.$store.dispatch('users/getUid')
      if (this.color !== 'error') {
        if (user === null) {
          this.dialog = true
        } else {
          await this.$store.dispatch('users/addToWishList', this.product.id)
          this.color = 'error'
        }
      } else {
        await this.$store.dispatch('users/deleteToWishList', this.product.id)
        this.color = ''
      }
    }
  },
  components: {
    BtnForCart
  }
}
</script>

<style lang="less">
.card {
  &__isNew {
    position: absolute;
    right: 0;
  }
  &__name {
    color: #ededed !important;
  }
  &__prices {
    display: flex;
    justify-content: center;
  }
  &__newPrice {
    margin-right: 20px;
    font-weight: 400 !important;
    color: #ededed;
  }

  &__oldPrice {
    position: relative;
    font-weight: 400 !important;
    &:before {
      border-bottom: 2px solid red;
      position: absolute;
      content: '';
      width: 100%;
      height: 50%;
      transform: rotate(-12deg);
    }
  }
}
</style>
