<template>
  <Loader v-if="loading" />
  <List v-else :items="mails" :mode="'Сообщений'" />
</template>

<script>
import List from '@/components/Content/List'
export default {
  async mounted () {
    await this.$store.dispatch('contact/read')
    this.loading = false
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    mails () {
      return this.$store.getters['contact/mails']
    }
  },
  components: {
    List
  }
}
</script>

<style>
</style>
