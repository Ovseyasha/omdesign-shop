<template>
  <Loader v-if="loading" />
  <List v-else :items="discounts" :mode="'Публикаций'" />
</template>

<script>
import List from '@/components/Content/List'
export default {
  async mounted () {
    await this.$store.dispatch('blog/read')
    this.loading = false
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    discounts () {
      return this.$store.getters['blog/articles']
    }
  },
  components: {
    List
  }
}
</script>

<style>
</style>
