<template>
  <v-col xl="3" lg="3" md="6" sm="12" cols="12">
    <v-card tile class="font-weight-light">
      <img v-if="product.isNew" class="card__isNew" :src="require('@/assets/new.png')" alt="is new" />
      <v-list-item>
        <v-list-item-content>
          <router-link class="card__name" :to="`/products/${product.id}`">
            <v-list-item-title class="font-weight-light headline">{{product.name}}</v-list-item-title>
          </router-link>
          <v-list-item-subtitle>{{product.category | ucFirst}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <router-link :to="`/products/${product.id}`">
        <v-img :src="product.photos[0].img" height="400"></v-img>
      </router-link>

      <v-card-text class="card__prices">
        <h1 class="card__newPrice">{{ product.price | price }}</h1>
        <h2 class="card__oldPrice" v-if="product.oldPrice">{{product.oldPrice | price }}</h2>
      </v-card-text>

      <v-card-actions>
        <v-row>
          <v-col cols="10">
            <BtnForCart :id="product.id" />
          </v-col>
          <v-col cols="2" align-self="center">
            <WishListAdder :id="product.id" />
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
import BtnForCart from '@/components/app/BtnForCart'
import WishListAdder from '@/components/app/WishListAdder'
export default {
  props: ['product'],
  data () {
    return {
    }
  },
  methods: {
  },
  components: {
    BtnForCart,
    WishListAdder
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
