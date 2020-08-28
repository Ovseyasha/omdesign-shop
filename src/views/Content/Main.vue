<template>
  <v-col xl="10" lg="10" cols="12">
    <Discounts></Discounts>
    <SalesProducts></SalesProducts>
    <LastProducts></LastProducts>
  </v-col>
</template>

<script>
import Discounts from '@/components/Content/Discounts'
import SalesProducts from '@/components/Content/SalesProducts'
import LastProducts from '@/components/Content/LastProducts'
export default {
  async mounted () {
    await this.$store.dispatch('meta/read')
    this.title = this.$store.getters['meta/list'][0].title
    this.desc = this.$store.getters['meta/list'][0].desc
  },
  components: {
    Discounts,
    SalesProducts,
    LastProducts
  },
  data () {
    return {
      title: '',
      desc: ''
    }
  },
  metaInfo () {
    return {
      title: '| ' + this.title.toUpperCase()
    }
  }
}
</script>

<style  lang="less">
@primary: #4d6a00;
@secondary: #a0c601;
.main__title {
  text-align: center;
  font-weight: 200;
}
</style>
