<template>
  <v-col xl="10" lg="10" md="10" cols="12">
    <v-row>
      <v-col cols="12">
        <h1 class="font-weight-thin text-center">О магазине</h1>
      </v-col>
    </v-row>
    <Loader v-if="loading" />
    <v-row v-else>
      <v-col v-for="(c,index) in cells" :key="index" xl="4" lg="4" md="4" cols="12">
        <template v-if="c.format === 'textWith'">
          <h2 class="font-weight-light">{{c.title}}</h2>
          <p class="font-weight-light">{{c.content}}</p>
        </template>
        <v-img v-if="c.format === 'photo'" :src="c.content.url"></v-img>
        <p class="c" v-if="c.format === 'code'" v-html="c.content"></p>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  async mounted () {
    await this.$store.dispatch('about/read')
    this.loading = false
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    cells () {
      return this.$store.getters['about/cells']
    }
  }
}
</script>

<style lang="less">
.c {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  iframe {
    width: 100% !important;
    position: absolute;
    height: 100%;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
  }
}
</style>
