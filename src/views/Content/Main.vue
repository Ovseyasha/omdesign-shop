<template>
  <v-app>
    <h1 class="main__title">Акции</h1>
    <Discounts></Discounts>
    <h1 class="main__title">Скидки</h1>
    <SalesProducts></SalesProducts>
    <h1 class="main__title">Последнии товары</h1>
    <LastProducts></LastProducts>
  </v-app>
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
