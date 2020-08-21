import firebase from 'firebase/app'

export default {
  namespaced: true,
  state: {
    discounts: []
  },
  getters: {
    getList (state) {
      return state.discounts
    }
  },
  mutations: {
    create (state, payload) {
      state.discounts.push(payload)
    },
    read (state, payload) {
      state.discounts = payload
    }
  },
  actions: {
    async create ({ commit }, payload) {
      try {
        const discount = await firebase.database().ref('discounts').push(payload)
        if (typeof (payload.url) !== 'string') {
          const slideName = Math.random() + payload.url.name
          const slideFile = payload.url
          const storagesSlide = await firebase.storage().ref(`discounts/${discount.key}/${slideName}`).put(slideFile)
          const slideUrl = await storagesSlide.ref.getDownloadURL()
          discount.url = slideUrl
          await firebase.database().ref(`discounts/${discount.key}`).update({ url: slideUrl })
        }
        commit('create', discount)
      } catch (error) {
        console.log(error)
      }
    },
    async read ({ commit }, payload) {
      try {
        const discounts = (await firebase.database().ref('discounts').once('value')).val()
        commit('read', discounts)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
