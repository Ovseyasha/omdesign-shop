<template>
  <v-col xl="10" lg="10" cols="12">
    <v-row justify="center">
      <h1 class="font-weight-thin text-center">Акции</h1>
    </v-row>
    <Loader v-if="loading" />
    <v-row v-else>
      <v-col cols="12">
        <v-row
          class="font-weight-light"
          v-for="(d,index) in discounts"
          :id="`d_${index}`"
          :key="index"
        >
          <v-col cols="12">
            <v-img :src="d.url"></v-img>
          </v-col>
          <v-col cols="12">
            <h2 class="font-weight-light secondary--text">Описание</h2>
            <p v-for="(p,index) in d.desc" :key="index">{{p}}</p>
          </v-col>
          <v-col cols="12" align="end" class="font-weight-light">
            <span class="secondary--text">Окончание акции:</span>
            {{new Date(d.endDate).toLocaleDateString() }}
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>

export default {
  async mounted () {
    await this.$store.dispatch('meta/read')
    this.title = this.$store.getters['meta/list'][4].title
    this.desc = this.$store.getters['meta/list'][4].desc
    await this.$store.dispatch('discounts/read')
    this.loading = false
  },
  data () {
    return {
      loading: true,
      title: '',
      desc: ''
    }
  },
  computed: {
    discounts () {
      return this.$store.getters['discounts/getList']
    }
  },
  metaInfo () {
    return {
      title: '| ' + this.title.toUpperCase()
    }
  }
}
</script>

<style lang="less">
</style>
