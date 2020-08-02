import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    meta: { layout: 'content' },
    component: () => import('@/views/Content/Main.vue')
  },
  {
    path: '/blog',
    name: 'Blog',
    meta: { layout: 'content' },
    component: () => import('@/views/Content/Blog.vue')
  },
  {
    path: '/about',
    name: 'About',
    meta: { layout: 'content' },
    component: () => import('@/views/Content/About.vue')
  },
  {
    path: '/contacts',
    name: 'Contacts',
    meta: { layout: 'content' },
    component: () => import('@/views/Content/Contacts.vue')
  },
  {
    path: '/discounts',
    name: 'Discounts',
    meta: { layout: 'content' },
    component: () => import('@/views/Content/Discounts.vue')
  },
  {
    path: '/category/:id',
    name: 'Products',
    meta: { layout: 'content' },
    component: () => import('@/views/Content/Products.vue')
  },
  {
    path: '/product/:id',
    name: 'Product',
    meta: { layout: 'content' },
    component: () => import('@/views/Content/Product.vue')
  },
  {
    path: '/login/',
    name: 'Login',
    meta: { layout: 'empty' },
    component: () => import('@/components/app/Login.vue')
  },
  {
    path: '/registration/',
    name: 'Registration',
    meta: { layout: 'empty' },
    component: () => import('@/components/app/Registration.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
