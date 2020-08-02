<template>
  <v-app-bar absolute shrink-on-scroll>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <div class="nav-logo">
      <img :src="require('@/assets/logo.png')" alt="logo" title="OMDESIGN" />
      <h1 class="nav-title">
        МАГАЗИН
        <br />АВТОРСКИХ ПРИНТОВ
      </h1>
    </div>

    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>
    <template v-slot:extension>
      <v-tabs fixed-tabs dark color="secondary">
        <v-tab class="link" v-for="t in tabs" :key="t.link" @click="goTo(t.link)">{{t.title}}</v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>

<script>
export default {
  data () {
    return {
      tabs: [
        {
          title: 'Главная',
          link: '/'
        },
        {
          title: 'Блог',
          link: '/blog'
        },
        {
          title: 'О магазине',
          link: '/about'
        },
        {
          title: 'Контакты',
          link: '/contacts'
        },
        {
          title: 'Акции',
          link: '/discounts'
        }
      ]
    }
  },
  methods: {
    goTo (link) {
      this.$router.push(link)
    }
  }
}
</script>

<style lang="less">
.link {
  color: white !important;
  text-decoration: none;
  font-size: 20px !important;
  font-weight: lighter !important;
}
.nav-logo {
  margin-left: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  .nav-title {
    font-size: 20px;
    font-weight: lighter;
  }
}
</style>
