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
        <v-row align="center">
          <v-col cols="9" class="nav-logo">
            <img :src="require('@/assets/logo.png')" alt="logo" title="OMDESIGN" />
            <h1 class="nav-title">
              МАГАЗИН
              <br />АВТОРСКИХ ПРИНТОВ
            </h1>
          </v-col>
          <v-col cols="3">
            <router-link to="/login" v-if="!isLogin">
              <v-btn icon>
                <v-icon color="accent">mdi-login</v-icon>
              </v-btn>
            </router-link>
            <router-link v-if="isLogin" to="/account">
              <v-avatar>
                <img :src="userAvatar" :alt="user.name" title="Личный кабинет" />
              </v-avatar>
            </router-link>
            <router-link to="/cart" class="mx-5">
              <v-btn icon title="Корзина">
                <v-badge color="secondary" :content="countInCart" :value="countInCart">
                  <v-icon color="accent">mdi-cart</v-icon>
                </v-badge>
              </v-btn>
            </router-link>

            <v-btn icon v-if="isLogin" title="Выход" class="mr-15" @click="logout">
              <v-icon color="accent">mdi-logout</v-icon>
            </v-btn>
          </v-col>
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
    await this.$store.dispatch('cart/loadCart', this.isLogin)
    await this.$store.dispatch('category/read')
    await this.$store.dispatch('users/getInfo')
    this.user = this.$store.getters['users/info']
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
      user: {}
    }
  },
  computed: {
    userAvatar () {
      return this.user.avatar?.url
    },
    isLogin () {
      return this.$store.getters['users/getUid'] !== null
    },
    countInCart () {
      return this.$store.getters['cart/count']
    },
    categories () {
      return this.$store.getters['category/categories']
    }
  },
  methods: {
    goTo (link) {
      this.$router.push(link)
    },
    async logout () {
      try {
        this.loading = true
        await this.$store.dispatch('users/logOut')
        await this.$store.commit('cart/updCart', [])
        await this.$store.dispatch('cart/loadCart', this.isLogin)
        this.user = {}
        this.$router.push('/')
        this.loading = false
      } catch (error) {

      }
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
