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
  components: {
    Discounts,
    SalesProducts,
    LastProducts
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
