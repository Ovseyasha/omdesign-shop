<template>
  <v-container>
    <v-row justify="space-around">
      <Loader v-if="loading" />
      <v-card
        v-else
        v-for="product in products"
        :key="product.id"
        max-width="350"
        class="mx-4 mb-10 card"
        :tile="tile"
      >
        <img class="card__isNew" :src="require('@/assets/new.png')" alt="is new" />
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
    this.products = await this.$store.getters['products/lastProducts']
    this.loading = false
  },
  data: () => ({
    tile: true,
    loading: true,
    products: []
  })
}
</script>

<style lang="less">
.card {
  &__isNew {
    position: absolute;
    right: 0;
  }
}
</style>
