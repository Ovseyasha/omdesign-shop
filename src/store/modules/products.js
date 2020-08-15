import firebase from 'firebase/app'
import store from '../index'
export default {
  namespaced: true,
  state: {
    products: []
  },
  getters: {
    products (state) {
      return state.products
    },
    productById: state => id => {
      return state.products.find(product => product.id === id)
    },
    salesProducts (state) {
      return state.products.filter(product => product.oldPrice !== false)
    },
    lastProducts (state) {
      return state.products.filter(product => product.isNew === true)
    },
    productsByCategory: state => categoryName => {
      return state.products.filter(product => {
        console.log(categoryName)
        return product.category.toLowerCase() === categoryName.toLowerCase()
      })
    }
  },
  mutations: {
    create () { },
    read (state, payload) {
      state.products = payload
    },
    update () { },
    delete () { }
  },
  actions: {
    async create ({ dispatch, commit }, payload) {
      try {
        const product = await firebase.database().ref('products').push(payload)
        for (let i = 0; i < payload.photos.length; i++) {
          if (typeof (payload.photos[i].img) !== 'string') {
            const slideName = Math.random() + payload.photos[i].img.name
            const slideFile = payload.photos[i].img
            const storagesSlide = await firebase.storage().ref(`products/${product.key}/slides/${slideName}`).put(slideFile)
            const slideUrl = await storagesSlide.ref.getDownloadURL()
            const title = payload.photos[i].title
            payload.photos[i].fileName = slideName
            await firebase.database().ref(`products/${product.key}/photos/${i}`).update({ img: slideUrl, title: title, fileName: slideName })
          }
        }
        await dispatch('read')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async read ({ commit }, payload) {
      try {
        const products = (await firebase.database().ref('products').once('value')).val()
        const uProducts = []
        if (products !== null) {
          Object.keys(products).forEach(key => {
            const s = products[key]
            uProducts.push({
              ...s,
              id: key
            })
          })
        }
        commit('read', uProducts)
      } catch (error) {
        console.log(error)
      }
    },
    delete () { },
    // products feedback
    async createReview ({ commit, dispatch }, payload) {
      try {
        await store.dispatch('users/getInfo')
        const user = store.getters['users/info']
        const sendReview = {
          ...payload.review,
          userId: user.id,
          userName: user.name,
          userSurName: user.surName,
          userAvatar: user.avatar.url,
          likes: 0,
          disLikes: 0,
          date: new Date().toLocaleDateString()
        }
        const review = await firebase.database().ref(`products/${payload.id}/feedback`).push(sendReview)
        for (let i = 0; i < payload.review.photos.length; i++) {
          const slideName = Math.random() + payload.review.photos[i].img.name
          const slideFile = payload.review.photos[i].img
          const storagesSlide = await firebase.storage().ref(`products/${payload.id}/feedback/${review.key}/${slideName}`).put(slideFile)
          const slideUrl = await storagesSlide.ref.getDownloadURL()
          const title = payload.review.photos[i].title
          payload.review.photos[i].fileName = slideName
          await firebase.database().ref(`products/${payload.id}/feedback/${review.key}/photos/${i}`).update({
            img: slideUrl,
            title,
            fileName: slideName
          })
        }
        await dispatch('read')
      } catch (error) {
        console.log(error)
      }
    },
    async likeReview ({ commit, dispatch }, payload) {
      try {

      } catch (error) {
        console.log(error)
      }
    }
  }
}
