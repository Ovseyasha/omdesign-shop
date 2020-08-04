<template>
  <v-btn
    class="font-weight-light"
    :color=" !inCart ? 'secondary' : 'primary'"
    tile
    @click="cartMove"
  >{{ !inCart? 'В корзину' : 'В корзине'}}</v-btn>
</template>

<script>
export default {
  async mounted () {
    const isset = this.$store.getters['cart/products'].find(product => product.id === this.id)
    if (typeof (isset) !== 'undefined') {
      console.log(this.inCart)
      this.inCart = true
    }
  },
  props: ['id'],
  data () {
    return {
      inCart: false
    }
  },
  computed: {
    isLogin () {
      return this.$store.getters['users/getUid'] !== null
    }
  },
  methods: {
    cartMove () {
      if (!this.inCart) {
        this.inCart = !this.inCart
        this.$store.dispatch('cart/add', {
          id: this.id,
          count: 1,
          isLogin: this.isLogin
        })
      } else {
        this.inCart = !this.inCart
        this.$store.dispatch('cart/delete', {
          id: this.id,
          isLogin: this.isLogin
        })
      }
    }
  }
}
</script>

<style>
</style>
