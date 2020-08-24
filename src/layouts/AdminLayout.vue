<template>
  <v-app id="inspire" class="font-weight-light">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item
          class="font-weight-light"
          v-for="item in links"
          :key="item.to"
          link
          router
          :to="item.to"
          exact
        >
          <v-list-item-action>
            <v-icon>mdi-{{item.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="font-weight-light">{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link to="/admin" class="secondary--text">АдминПанель</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn router-link to="/" icon>
        <v-icon>mdi-link-variant</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <transition
            mode="out-in"
            enter-active-class="animate__animated animate__faster  animate__fadeIn"
            leave-active-class="animate__animated animate__faster animate__fadeOut"
          >
            <router-view></router-view>
          </transition>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    links: [
      {
        to: '/admin/categories',
        title: 'Категории',
        icon: 'format-list-bulleted'
      },
      {
        to: '/admin/products',
        title: 'Продукты',
        icon: 'shopping'
      },
      {
        to: '/admin/orders',
        title: 'Заказы',
        icon: 'home-currency-usd'
      },
      {
        to: '/admin/about',
        title: 'О магазине',
        icon: 'shoe-heel'
      },
      {
        to: '/admin/blog',
        title: 'Мой блог',
        icon: 'clipboard-edit-outline'
      },
      {
        to: '/admin/discounts',
        title: 'Акции',
        icon: 'gift-outline '
      },
      {
        to: '/admin/contacts',
        title: 'Контакты',
        icon: 'email'
      }
    ]
  })
}
</script>

<style lang="less">
</style>
