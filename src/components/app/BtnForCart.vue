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
    this.isLogin = await this.$store.getters['users/getUid'] !== null
    await this.$store.dispatch('cart/loadCart', this.isLogin)
    const isset = this.$store.getters['cart/products'].find(product => product.id === this.id)
    if (typeof (isset) !== 'undefined') {
      this.inCart = true
    }
  },
  props: ['id', 'selectedSize'],
  data () {
    return {
      inCart: false,
      isLogin: '',
      loading: true
    }
  },
  computed: {
  },
  methods: {
    async cartMove () {
      try {
        this.loading = true
        if (!this.inCart) {
          this.inCart = !this.inCart
          await this.$store.dispatch('cart/add', {
            id: this.id,
            count: 1,
            selectedSize: this.selectedSize || null,
            isLogin: this.isLogin
          })
        } else {
          this.inCart = !this.inCart
          await this.$store.dispatch('cart/delete', {
            id: this.id,
            isLogin: this.isLogin
          })
        }
        this.loading = false
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
</style>
