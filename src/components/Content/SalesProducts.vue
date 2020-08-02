<template>
  <v-container>
    <v-row justify="space-around">
      <Loader v-if="loading" />
      <v-card
        v-else
        v-for="product in products"
        :key="product.id"
        max-width="350"
        class="mx-auto"
        :tile="tile"
      >
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
          <h2 class="card__oldPrice">{{ product.oldPrice | price }}</h2>
        </v-card-text>

        <v-card-actions>
          <v-btn color="secondary" :tile="true">В корзину</v-btn>
          <router-link class="card__more" :to="`/product/${product.id}`">
            <v-btn text color="primary" :tile="true">Подробнее</v-btn>
          </router-link>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  async mounted () {
    this.products = await this.$store.getters['products/salesProducts']
    this.loading = false
  },
  data: () => ({
    tile: true,
    loading: true,
    products: []
  })
}
</script>

<style lang="less" >
.card {
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
