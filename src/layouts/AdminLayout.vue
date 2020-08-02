<template>
  <v-app>
    <h2>admin page</h2>
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__faster  animate__fadeIn"
      leave-active-class="animate__animated animate__faster animate__fadeOut"
    >
      <router-view></router-view>
    </transition>
  </v-app>
</template>

<script>
export default {

}
</script>

<style lang="less">
</style>
