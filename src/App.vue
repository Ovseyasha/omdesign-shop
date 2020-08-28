<template>
  <v-app>
    <transition
      mode="out-in"
      enter-active-class="animate__animated animate__faster  animate__fadeIn"
      leave-active-class="animate__animated animate__faster animate__fadeOut"
    >
      <component :is="layout">
        <router-view class="page"></router-view>
      </component>
    </transition>
  </v-app>
</template>

<script>
import ContentLayout from '@/layouts/ContentLayout'
import AdminLayout from '@/layouts/AdminLayout'
import EmptyLayout from '@/layouts/EmptyLayout'
export default {
  name: 'App',
  metaInfo () {
    return {
      titleTemplate: 'OMDESIGN-SHOP %s'
    }
  },
  components: {
    ContentLayout,
    AdminLayout,
    EmptyLayout
  },
  computed: {
    layout () {
      return (this.$route.meta.layout || 'content') + '-layout'
    }
  },
  data: () => ({
    //
  })
}
</script>
<style lang="less" >
a {
  text-decoration: none !important;
}
</style>
