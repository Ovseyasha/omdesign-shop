import Vue from 'vue'
import Vuex from 'vuex'

import category from './modules/category'
import cart from './modules/cart'
import products from './modules/products'
import blog from './modules/blog'
import about from './modules/about'
import discounts from './modules/discounts'
import users from './modules/users'
import orders from './modules/orders'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    category,
    cart,
    products,
    blog,
    about,
    discounts,
    users,
    orders
  }
})
