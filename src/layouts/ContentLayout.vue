<template>
  <v-app id="inspire">
    <v-navigation-drawer class="category" v-model="drawer" color="primary" absolute>
      <v-list dense nav class="py-0">
        <v-list-item two-line :class="'px-0'" style="margin-top: 150px ;">
          <h1 class="category-title">Категории</h1>
        </v-list-item>

        <v-divider></v-divider>
        <router-link v-for="item in categories" :key="item.id" :to="`/category/${item.id}`">
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-list>
      <v-divider></v-divider>
      <h1>Сортировка</h1>
    </v-navigation-drawer>

    <v-app-bar app clipped height="100px" fixed class="nav">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-container>
        <v-row justify="space-around" align="center">
          <div class="nav-logo">
            <img :src="require('@/assets/logo.png')" alt="logo" title="OMDESIGN" />
            <h1 class="nav-title">
              МАГАЗИН
              <br />АВТОРСКИХ ПРИНТОВ
            </h1>
          </div>
          <v-spacer></v-spacer>

          <v-btn icon>
            <router-link to="/login">
              <v-icon color="accent">mdi-login</v-icon>
            </router-link>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-cart</v-icon>
          </v-btn>
          <!-- только если ползователь вошел  -->
          <!-- <v-avatar>
            <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
          </v-avatar>
          <v-btn icon>
            <v-icon>mdi-logout</v-icon>
          </v-btn>-->
        </v-row>
      </v-container>

      <template v-slot:extension>
        <v-tabs fixed-tabs center-active dark color="secondary">
          <v-tab class="link" v-for="t in tabs" :key="t.link" @click="goTo(t.link)">{{t.title}}</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <router-view></router-view>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// import Header from '@/components/app/Header'
export default {
  async mounted () {
    // ПОТОМ взывать диспатч с сервера
    this.categories = await this.$store.getters['category/categories']
    this.loading = false
  },
  data () {
    return {
      loading: true,
      drawer: false,
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
      ],
      categories: []
    }
  },
  methods: {
    goTo (link) {
      this.$router.push(link)
    }
  },
  components: {
    // Header
  }
}
</script>

<style lang="less">
.category {
  z-index: 2 !important;
}
.link {
  color: white !important;
  text-decoration: none;
  font-size: 20px !important;
  font-weight: lighter !important;
  @media (max-width: 600px) {
    font-size: 14px !important;
  }
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
.category-title {
  text-align: center;
  font-weight: lighter;
}
</style>
