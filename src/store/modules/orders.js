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
    },
    readList (state, payload) {
      state.orders = payload
    },
    update (state, { id, v }) {
      state.orders.forEach((o, i) => {
        if (o.id === id) {
          state.orders[i].state = v
        }
      })
    },
    delete (state, { id }) {
      state.orders.forEach((o, i) => {
        if (o.id === id) {
          state.orders.splice(i, 1)
        }
      })
    }
  },
  actions: {
    async readList ({ commit }) {
      try {
        const orders = (await firebase.database().ref('orders').once('value')).val()
        const o = []
        Object.keys(orders).forEach(key => {
          const nO = orders[key]
          o.push(
            {
              ...nO,
              id: key
            }
          )
        })
        commit('readList', o)
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
    async update ({ commit }, { id, v }) {
      try {
        await firebase.database().ref(`orders/${id}/state`).set(v)
        commit('update', { id, v })
      } catch (error) {
        console.log(error)
      }
    },
    async delete ({ commit }, { id }) {
      try {
        await firebase.database().ref(`orders/${id}`).remove()
        commit('delete', { id })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
