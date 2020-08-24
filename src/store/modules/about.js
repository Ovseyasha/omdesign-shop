
import firebase from 'firebase/app'

export default {
  namespaced: true,
  state: {
    cells: []
  },
  getters: {
    cells (state) {
      return state.cells
    }
  },
  mutations: {
    set (state, payload) {
      state.cells = payload
    },
    read (state, payload) {
      state.cells = payload
    }
  },
  actions: {
    async read ({ commit }) {
      try {
        const about = (await firebase.database().ref('about').once('value')).val()
        commit('read', about)
      } catch (error) {

      }
    },
    async set ({ commit }, payload) {
      try {
        for (let i = 0; i < payload.length; i++) {
          if (payload[i].content.url) {
            if (typeof (payload[i].content.url) !== 'string') {
              // delete old
              if (payload[i].content.fileName) {
                await firebase.storage().ref().child(`about/content/${payload[i].content.fileName}`).delete()
              }
              // create new
              const slideName = Math.random() + payload[i].content.url.name
              const slideFile = payload[i].content.url
              const storages = await firebase.storage().ref(`about/content/${slideName}`).put(slideFile)
              const slideUrl = await storages.ref.getDownloadURL()
              payload[i].content.url = slideUrl
              payload[i].content.fileName = slideName
            }
          }
        }
        await firebase.database().ref('about').set(payload)
        commit('set', payload)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
