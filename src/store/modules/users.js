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
    user: {},
    nameAndPhoto: []
  },
  getters: {
    info (state) {
      return state.user
    }
  },
  mutations: {
    getInfo (state, payload) {
      state.user = payload
    },
    logOut (state) {
      state.user = {}
    }
  },
  actions: {
    async register ({ dispatch, commit }, payload) {
      try {
        const user = payload
        await firebase.auth().createUserWithEmailAndPassword(user.email, user.pass)
        const uid = await dispatch('getUid')
        delete user.pass
        await firebase.database().ref(`/users/${uid}/`).set(user)
        const fileName = user.avatar.name
        const ext = fileName.slice(fileName.lastIndexOf('.'))
        const storages = await firebase.storage().ref(`users/${uid}/avatar/img${ext}`).put(user.avatar)
        const imageUrl = await storages.ref.getDownloadURL()
        user.avatar.url = imageUrl
        user.avatar.ext = ext
        await firebase.database().ref('users').child(uid).update({ avatar: user.avatar })
      } catch (error) {
        console.log(error)
        throw error
        // добавить вывод ошибок в modal
      }
    },
    async login ({ dispatch, commit }, payload) {
      try {
        await firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        await dispatch('getInfo')
      } catch (error) {
        // error logic here
        console.log(error)
        throw error
      }
    },
    getUid ({ commit }) {
      const user = firebase.auth().currentUser
      return user ? user.uid : null
    },
    async getInfo ({ dispatch, commit }) {
      try {
        const uid = await dispatch('getUid')
        if (uid !== null) {
          const data = (await firebase.database().ref('users').child(uid).once('value')).val()
          const user = {
            ...data,
            id: uid
          }
          commit('getInfo', user)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async logOut ({ commit }) {
      await firebase.auth().signOut()
      commit('logOut')
    }
  }
}
