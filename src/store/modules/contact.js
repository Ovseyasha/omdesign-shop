import firebase from 'firebase/app'

export default {
  namespaced: true,
  state: {
    mails: []
  },
  getters: {
    mails (state) {
      return state.mails
    }
  },
  mutations: {
    create (state, payload) {
      state.mails.push(payload)
    },
    read (state, payload) {
      state.mails = payload
    },
    update (state, payload) {
      state.mails.forEach((m, i) => {
        if (m.id === payload) {
          state.mails[i].isNew = false
        }
      })
    },
    delete (state, payload) {
      state.mails.forEach((m, i) => {
        if (m.id === payload) {
          state.mails.splice(i, 1)
        }
      })
    }
  },
  actions: {
    async create ({ commit }, payload) {
      try {
        // когда будет хостинг сделать почту и на этом и на другом сайте
        const m = await firebase.database().ref('contact').push(payload)
        payload.id = m.key
        commit('create', payload)
      } catch (error) {
        console.log(error)
      }
    },
    async read ({ commit }) {
      try {
        const contact = (await firebase.database().ref('contact').once('value')).val()
        const newContacts = []
        if (contact !== null) {
          Object.keys(contact).forEach(key => {
            const s = contact[key]
            newContacts.push({
              ...s,
              id: key
            })
          })
        }
        commit('read', newContacts)
      } catch (error) {
        console.log(error)
      }
    },
    async update ({ commit }, payload) {
      try {
        await firebase.database().ref(`contact/${payload}`).update({ isNew: false })
        commit('update', payload)
      } catch (error) {
        console.log(error)
      }
    },
    async delete ({ commit }, payload) {
      try {
        await firebase.database().ref(`contact/${payload}`).remove()
        commit('delete', payload)
      } catch (error) {
      }
    }
  }
}
