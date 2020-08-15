<template>
  <v-app id="inspire">
    <v-navigation-drawer class="category" v-model="drawer" color="primary" fixed temporary>
      <v-list class="font-weight-light">
        <v-list-item two-line class="mt-15 pt-10">
          <h1 class="category-title">Категории</h1>
        </v-list-item>

        <v-divider></v-divider>
        <v-list-item-group>
          <v-list-item
            v-for="item in categories"
            :key="item.id"
            link
            router
            :to="`/category/${item.id}`"
          >
            <v-list-item-content>
              <v-list-item-title>{{item.name}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-divider></v-divider>
      <h1>Сортировка</h1>
    </v-navigation-drawer>

    <v-app-bar app clipped height="100px" fixed>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-container>
        <v-row align="center" justify="center">
          <v-col xl="8" lg="8" md="7" cols="5">
            <v-row justify="center">
              <v-col xl="7" lg="7" cols="12">
                <router-link to="/">
                  <v-img :src="require('@/assets/logo.png')" alt="logo" title="OMDESIGN" />
                </router-link>
              </v-col>
              <v-col xl="4" lg="4" cols="3" class="d-none d-md-none d-sm-none d-lg-flex">
                <h1 class="font-weight-light text-h6 align-self-center">
                  МАГАЗИН
                  <br />АВТОРСКИХ ПРИНТОВ
                </h1>
              </v-col>
            </v-row>
          </v-col>
          <v-col xl="2" lg="3" md="3" cols="7" align-self="center">
            <v-row justify="center" align="center">
              <v-col cols="6" align="center">
                <router-link to="/cart">
                  <v-btn icon title="Корзина">
                    <v-badge color="secondary" :content="countInCart" :value="countInCart">
                      <v-icon color="accent">mdi-cart</v-icon>
                    </v-badge>
                  </v-btn>
                </router-link>
              </v-col>
              <v-col cols="6" align="left">
                <v-btn @click="menu = !menu" icon title="Навигация">
                  <v-icon>mdi-navigation</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-navigation-drawer temporary v-model="menu" color="primary" right fixed dark>
      <v-list class="font-weight-light">
        <v-col cols="12" v-if="isLogin">
          <v-row justify="center">
            <v-col cols="3" align-self="center">
              <router-link to="/account" title="Личный кабинет">
                <v-avatar>
                  <img :src="userAvatar" alt="avatar" />
                </v-avatar>
              </router-link>
            </v-col>
            <v-col cols="5" align-self="center">
              <h3 class="font-weight-light text-subtitle-1">Здравствуйте</h3>
              <h4 class="font-weight-light text-subtitle-2">{{user.name}}</h4>
            </v-col>
            <v-col cols="3" offset="1" align-self="center">
              <v-btn icon title="Выход" @click="logout">
                <v-icon color="accent">mdi-logout</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>

        <router-link v-else to="/login">
          <v-list-item tile two-line>
            <v-list-item-icon>
              <v-icon x-large class="mt-5">mdi-account-circle</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Здравствуйте</v-list-item-title>
              <v-list-item-subtitle>Войдите в систему</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </router-link>

        <v-divider></v-divider>
        <v-list-item-group>
          <v-list-item v-for="t in tabs" :key="t.link" link router :to="t.link">
            <v-list-item-content>
              <v-list-item-title>{{ t.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
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
export default {
  async mounted () {
    // ПОТОМ взывать диспатч с сервера
    await this.$store.dispatch('users/getInfo')
    this.user = this.$store.getters['users/info']
    this.isLogin = this.$store.getters['users/getUid'] !== null
    await this.$store.dispatch('cart/loadCart', this.isLogin)
    await this.$store.dispatch('category/read')
    this.loading = false
  },
  data () {
    return {
      loading: true,
      drawer: false,
      menu: false,
      isLogin: '',
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
    countInCart () {
      return this.$store.getters['cart/count']
    },
    categories () {
      return this.$store.getters['category/categories']
    }
  },
  methods: {
    goTo (link) {
      if (this.$route.path !== link) {
        this.$router.push(link)
      }
    },
    async logout () {
      try {
        this.loading = true
        await this.$store.dispatch('users/logOut')
        await this.$store.commit('cart/updCart', [])
        await this.$store.dispatch('cart/loadCart', this.isLogin)
        this.isLogin = this.$store.getters['users/getUid'] !== null
        this.user = {}
        this.loading = false
        this.$router.push('/')
      } catch (error) {
        console.log(error)
      }
    }
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
  @media (max-width: 600px) {
    display: none;
  }
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
