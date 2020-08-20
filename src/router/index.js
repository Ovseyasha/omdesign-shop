import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app'

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
    path: '/products/:id',
    name: 'Product',
    meta: { layout: 'content' },
    component: () => import('@/views/Content/Product.vue')
  },
  {
    path: '/login',
    name: 'Login',
    meta: { layout: 'empty' },
    component: () => import('@/components/app/Login.vue')
  },
  {
    path: '/registration',
    name: 'Registration',
    meta: { layout: 'empty' },
    component: () => import('@/components/app/Registration.vue')
  },
  {
    path: '/account',
    name: 'Account',
    meta: { layout: 'content', auth: true },
    component: () => import('@/views/Content/Account.vue')
  },
  {
    path: '/account/Edit',
    name: 'EditProfile',
    meta: { layout: 'content', auth: true },
    component: () => import('@/views/Content/EditProfile.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    meta: { layout: 'content' },
    component: () => import('@/views/Content/Cart.vue')
  },
  {
    path: '/checkout',
    name: 'Checkout',
    meta: { layout: 'content', auth: true },
    component: () => import('@/views/Content/Checkout.vue')
  },
  // admin
  {
    path: '/admin',
    name: 'AdminMain',
    meta: { layout: 'admin', auth: true, admin: true },
    component: () => import('@/views/Admin/Main.vue')
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    meta: { layout: 'admin', auth: true, admin: true },
    component: () => import('@/views/Admin/Products/List.vue')
  },
  {
    path: '/admin/products/add',
    name: 'AdminProductsAdd',
    meta: { layout: 'admin', auth: true, admin: true },
    component: () => import('@/views/Admin/Products/Add.vue')
  },
  {
    path: '/admin/products/edit/:id',
    name: 'AdminProductsEdit',
    meta: { layout: 'admin', auth: true, admin: true },
    component: () => import('@/views/Admin/Products/Edit.vue')
  },
  {
    path: '/admin/categories',
    name: 'AdminCategories',
    meta: { layout: 'admin', auth: true, admin: true },
    component: () => import('@/views/Admin/Categories/List.vue')
  },
  {
    path: '/admin/categories/add',
    name: 'AdminCategoriesAdd',
    meta: { layout: 'admin', auth: true, admin: true },
    component: () => import('@/views/Admin/Categories/Add.vue')
  },
  {
    path: '/admin/categories/edit/:id',
    name: 'AdminCategoriesEdit',
    meta: { layout: 'admin', auth: true, admin: true },
    component: () => import('@/views/Admin/Categories/Edit.vue')
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    meta: { layout: 'admin', auth: true, admin: true },
    component: () => import('@/views/Admin/Orders/List.vue')
  },
  {
    path: '/admin/orders/view/:id',
    name: 'AdminOrdersView',
    meta: { layout: 'admin', auth: true, admin: true },
    component: () => import('@/views/Admin/Orders/View.vue')
  },
  {
    path: '/admin/blog',
    name: 'AdminBlog',
    meta: { layout: 'admin', auth: true, admin: true },
    component: () => import('@/views/Admin/Blog/List.vue')
  },
  {
    path: '/admin/blog/add',
    name: 'AdminBlogAdd',
    meta: { layout: 'admin', auth: true, admin: true },
    component: () => import('@/views/Admin/Blog/Add.vue')
  },
  {
    path: '/admin/blog/edit/:id',
    name: 'AdminBlogEdit',
    meta: { layout: 'admin', auth: true, admin: true },
    component: () => import('@/views/Admin/Blog/Edit.vue')
  },
  {
    path: '/admin/discounts',
    name: 'AdminDiscounts',
    meta: { layout: 'admin', auth: true, admin: true },
    component: () => import('@/views/Admin/Discounts/List.vue')
  },
  {
    path: '/admin/discounts/add',
    name: 'AdminDiscountsAdd',
    meta: { layout: 'admin', auth: true, admin: true },
    component: () => import('@/views/Admin/Discounts/Add.vue')
  },
  {
    path: '/admin/discounts/edit/:id',
    name: 'AdminDiscountsEdit',
    meta: { layout: 'admin', auth: true, admin: true },
    component: () => import('@/views/Admin/Discounts/Edit.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const rules = currentUser ? ((await firebase.database().ref('users').child(currentUser.uid).once('value')).val()).rules : ''
  // проверка есть ли у путя тег мета с требование авторизации
  const reuireAuth = to.matched.some(record => record.meta.auth)
  if (reuireAuth && !currentUser) {
    next('/login?message=login')
  } else {
    next()
  }
  const isAdmin = rules === 'admin'
  const checkAdmin = to.matched.some(record => record.meta.admin)
  if (checkAdmin && !isAdmin) {
    next('/')
  } else {
    next()
  }
})
export default router
