<template>
  <Loader v-if="loading" />
  <List v-else :items="orders" :mode="'Заказов'" />
</template>

<script>
import List from '@/components/Content/List'
export default {
  async mounted () {
    await this.$store.dispatch('orders/readList')
    this.loading = false
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    orders () {
      return this.$store.getters['orders/list']
    }
  },
  components: {
    List
  }
}
</script>

<style>
</style>
