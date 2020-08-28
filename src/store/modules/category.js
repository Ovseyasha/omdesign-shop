import firebase from 'firebase/app'
export default {
  namespaced: true,
  state: {
    categories: []
  },
  getters: {
    categories (state) {
      return state.categories
    },
    getCategoryName: state => id => {
      return state.categories.find(category => {
        if (category.id === id) {
          return category
        }
      })
    }
  },
  mutations: {
    create (state, payload) {
      state.categories.push(payload)
    },
    read (state, payload) {
      state.categories = payload
    },
    update (state, { name, id }) {
      state.categories.forEach(c => {
        if (c.id === id) {
          c.name = name
        }
      })
    },
    delete (state, payload) {
      state.categories.forEach((c, i) => {
        if (c.id === payload) {
          state.categories.splice(i, 1)
        }
      })
    }
  },
  actions: {
    async create ({ commit, state }, payload) {
      try {
        const cat = await firebase.database().ref('categories').push(payload)
        commit('create', {
          name: payload,
          id: cat.key
        })
      } catch (error) {
      }
    },
    async read ({ dispatch, commit, state }, payload) {
      const cat = (await firebase.database().ref('categories').once('value')).val()
      const categories = []
      if (cat !== null) {
        Object.keys(cat).forEach(key => {
          const c = cat[key]
          categories.push({
            name: c,
            id: key
          })
        })
      }
      commit('read', categories)
    },
    async update ({ commit }, { name, id }) {
      try {
        await firebase.database().ref(`categories/${id}`).set(name)
        commit('update', { name, id })
      } catch (error) {
      }
    },
    async delete ({ commit }, payload) {
      try {
        await firebase.database().ref(`categories/${payload}`).remove()
        commit('delete', payload)
      } catch (error) {
      }
    }
  }
}
