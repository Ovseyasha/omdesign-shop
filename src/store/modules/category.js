import firebase from 'firebase/app'
export default {
  namespaced: true,
  state: {
    categories: []
  },
  getters: {
    categories (state) {
      return state.categories
    }
    // getCategoryName: state => id => {
    //   return state.categories.find(category => {
    //     return category.id === +id
    //   })
    // }
  },
  mutations: {
    read (state, payload) {
      state.categories = payload
    }
  },
  actions: {
    async create ({ dispatch, commit, state }, payload) {
      try {
        await firebase.database().ref('categories').push(payload)
        await dispatch('read')
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
    update () { },
    delete () { }
  }
}
