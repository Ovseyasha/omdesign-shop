import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import VueMeta from 'vue-meta'
import Vuelidate from 'vuelidate'
import VueCookie from 'vue-cookie'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
// global components
import Loader from '@/components/app/Loader'
import Messager from '@/components/app/Messager'
import Paginate from 'vuejs-paginate'
// global filters
import ucFirst from '@/filters/ucFirst.filter'
import price from '@/filters/price.filter'
// firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/analytics'

// init global components
Vue.component('Loader', Loader)
Vue.component('Messager', Messager)
Vue.component('Paginate', Paginate)
// init plugins
Vue.use(VueMeta)
Vue.use(Vuelidate)
Vue.use(VueCookie)
// filters
Vue.filter('ucFirst', ucFirst)
Vue.filter('price', price)

Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: 'AIzaSyC_k2nVAialbIMlewbrCmSWjncejjXgOZ8',
  authDomain: 'omdsesign-shop.firebaseapp.com',
  databaseURL: 'https://omdsesign-shop.firebaseio.com',
  projectId: 'omdsesign-shop',
  storageBucket: 'omdsesign-shop.appspot.com',
  messagingSenderId: '79279424764',
  appId: '1:79279424764:web:2594f99de351ff00d84379',
  measurementId: 'G-FEBKWWR48R'
}

firebase.initializeApp(firebaseConfig)
firebase.analytics()
let app

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})
