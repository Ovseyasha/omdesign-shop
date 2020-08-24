<template>
  <Loader v-if="loading" />
  <List v-else :items="discounts" :mode="'Акций'" />
</template>

<script>
import List from '@/components/Content/List'
export default {
  async mounted () {
    await this.$store.dispatch('discounts/read')
    this.loading = false
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    discounts () {
      return this.$store.getters['discounts/getList']
    }
  },
  components: {
    List
  }
}
</script>

<style>
</style>
