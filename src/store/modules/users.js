import firebase from 'firebase/app'
export default {
  namespaced: true,
  state: {
    // users: [
    //   {
    //     id: 1,
    //     email: 'admin@mail.ru',
    //     pass: 123,
    //     name: 'admin',
    //     SurName: 'adminovich',
    //     city: 'ivanteevka',
    //     sex: 'male',
    //     dataBirth: '14.12.1999',
    //     phone: '89015177656',
    //     street: 'chleb',
    //     building: 23,
    //     apartament: 21,
    //     wishList: [
    //       // productIds
    //       1, 2, 5
    //     ],
    //     listOrders: [
    //       {
    //         // order
    //       }
    //     ]
    //   }
    // ]
    user: {}
  },
  getters: {
    info (state) {
      return state.user
    }
  },
  mutations: {},
  actions: {
    async register ({ commit }, { user }) {
      console.log(user)
    },
    async login ({ commit }, payload) {
      try {
        const admin = await firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        commit('setAdmin', { id: admin.user.uid })
      } catch (error) {
        // error logic here
        console.log(error)
        throw error
      }
    },
    getUid ({ commit }) {
      const user = firebase.auth().currentUser
      commit('setAdmin', { id: user.uid })
      return user ? user.uid : null
    },
    async logOut ({ commit }) {
      await firebase.auth().signOut()
      commit('setAdmin', null)
    }
  }
}
