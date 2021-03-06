import store from '../index'
import firebase from 'firebase/app'
import VueCookie from 'vue-cookie'
export default {
  namespaced: true,
  state: {
    products: [],
    total: {}
  },
  getters: {
    products (state) {
      return state.products
    },
    count (state) {
      if (state.products) {
        return state.products.length
      }
    },
    total (state) {
      return state.total
    }
  },
  mutations: {
    updCart (state, payload) {
      state.products = payload
    },
    loadCart (state, payload) {
      state.products = payload
    },
    total (state, payload) {
      state.total = payload
    }
  },
  actions: {
    async loadCart ({ dispatch, commit }, payload) {
      try {
        if (payload) {
          const id = await store.dispatch('users/getUid')
          const products = (await firebase.database().ref(`users/${id}/productInCart`).once('value')).val()
          await dispatch('updCart', products || [])
        } else {
          if (JSON.parse(VueCookie.get('productInCart'))) {
            await dispatch('updCart', JSON.parse(VueCookie.get('productInCart')))
          } else {
            await dispatch('updCart', [])
          }
        }
      } catch (error) {
      }
    },
    async updCart ({ commit }, payload) {
      try {
        const id = await store.dispatch('users/getUid')
        if (id !== null) {
          await firebase.database().ref(`users/${id}/productInCart`).set(payload)
          commit('updCart', payload)
        } else {
          commit('updCart', payload)
        }
      } catch (error) {
      }
    },
    async add ({ dispatch, commit, state }, payload) {
      try {
        const isset = state.products.find(product => product.id === payload.id)
        if (typeof (isset) === 'undefined') {
          state.products.push(payload)
        }
        if (!payload.isLogin) {
          VueCookie.set('productInCart', JSON.stringify(state.products), 1)
        }
        await dispatch('updCart', state.products)
      } catch (error) {
      }
    },
    async delete ({ dispatch, commit, state }, payload) {
      try {
        const index = state.products.findIndex(product => product.id === payload.id)
        state.products.splice(index, 1)
        if (!payload.isLogin) {
          VueCookie.set('productInCart', JSON.stringify(state.products), 1)
        }
        await dispatch('updCart', state.products)
      } catch (error) {
      }
    },
    async clearCart ({ dispatch, commit, state }, payload) {
      try {
        const id = await store.dispatch('users/getUid')
        await firebase.database().ref(`users/${id}/productInCart`).remove()
      } catch (error) {
      }
    },
    async changeCount ({ dispatch, commit, state }, payload) {
      try {
        for (const product of state.products) {
          if (product.id === payload.id) {
            product.count = payload.count
          }
        }
        if (!payload.isLogin) {
          VueCookie.set('productInCart', JSON.stringify(state.products), 1)
        }
        await dispatch('updCart', state.products)
      } catch (error) {
      }
    },
    async changeSize ({ dispatch, commit, state }, payload) {
      try {
        if (payload.isLogin) {
          const id = await store.dispatch('users/getUid')
          const list = (await firebase.database().ref(`users/${id}/productInCart`).once('value')).val()
          // list.find(p => p.id === payload.id)
          const ind = list.findIndex(p => p.id === payload.id)
          await firebase.database().ref(`users/${id}/productInCart/${ind}/selectedSize`).set(payload.v)
          await dispatch('loadCart', payload.isLogin)
        }
      } catch (error) {
      }
    }
  }
}
