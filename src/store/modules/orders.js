import store from '../index'
import firebase from 'firebase/app'
export default {
  namespaced: true,
  state: {
    orders: [],
    userOrders: []
  },
  getters: {
    list (state) {
      return state.orders
    },
    userOrders (state) {
      return state.userOrders
    }
  },
  mutations: {
    create (state, payload) {
      state.orders.push(payload)
    },
    readByUserId (state, payload) {
      state.userOrders = payload
    }
  },
  actions: {
    async readList () {
      try {

      } catch (error) {
        console.log(error)
      }
    },
    async readByUserId ({ commit }) {
      try {
        const id = await store.dispatch('users/getUid')
        let orders = (await firebase.database().ref('orders').orderByChild('userId').equalTo(id).once('value')).val()
        orders = Object.values(orders)
        commit('readByUserId', orders)
      } catch (error) {
        console.log(error)
      }
    },
    async create ({ dispatch, commit }, payload) {
      try {
        const id = await store.dispatch('users/getUid')
        const order = {
          ...payload,
          userId: id,
          state: 'Новый заказ'
        }
        await firebase.database().ref('orders').push(order)
        commit('create', order)
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
