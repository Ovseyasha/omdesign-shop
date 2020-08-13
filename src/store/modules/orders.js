import store from '../index'
import firebase from 'firebase/app'
export default {
  namespaced: true,
  state: {
    orders: []
  },
  getters: {
    list (state) {
      return state.orders
    }
    // отредачить
    // itemById(){
    //   return 1
    // }
  },
  mutations: {
    create (state, payload) {
      state.orders.push(payload)
    }
  },
  actions: {
    async readList () {
      try {

      } catch (error) {
        console.log(error)
      }
    },
    async readByUserId () {
      try {

      } catch (error) {
        console.log(error)
      }
    },
    async create ({ dispatch, commit }, payload) {
      try {
        const id = await store.dispatch('users/getUid')
        await firebase.database().ref(`users/${id}/orders`).push(payload)
        await firebase.database().ref('orders').push(payload)
        commit('create', payload)
      } catch (error) {
        console.log(error)
      }
    },
    async update () {
      try {

      } catch (error) {
        console.log(error)
      }
    },
    async delete () {
      try {

      } catch (error) {
        console.log(error)
      }
    }
  }
}
