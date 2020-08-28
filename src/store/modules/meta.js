import firebase from 'firebase/app'
export default {
  namespaced: true,
  state: {
    meta: {}
  },
  getters: {
    list (state) {
      return state.meta
    }
  },
  mutations: {
    move (state, payload) {
      state.meta = payload
    }
  },
  actions: {
    async read ({ commit }) {
      try {
        const meta = (await firebase.database().ref('meta').once('value')).val()
        commit('move', meta)
      } catch (error) {

      }
    },
    async update ({ commit }, payload) {
      try {
        await firebase.database().ref('meta').set(payload)
        commit('move', payload)
      } catch (error) {
        console.log(error)
        throw error
      }
    }
  }
}
