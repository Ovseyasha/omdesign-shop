import firebase from 'firebase/app'
export default {
  namespaced: true,
  state: {
    user: {},
    nameAndPhoto: [],
    getUid: null
  },
  getters: {
    info (state) {
      return state.user
    },
    getUid (state) {
      return state.getUid
    }
  },
  mutations: {
    getInfo (state, payload) {
      state.user = payload
    },
    logOut (state) {
      state.user = {}
      state.getUid = null
    },
    getUid (state, payload) {
      state.getUid = payload
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
        commit('getUid', uid)
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
      commit('getUid', user ? user.uid : null)
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
        commit('getUid', uid)
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async addToWishList ({ dispatch, commit }, payload) {
      try {
        const uid = await dispatch('getUid')
        const updWishList = (await firebase.database().ref(`users/${uid}/wishList`).once('value')).val() || []
        updWishList.push(payload)
        // console.log(updWishList)
        await firebase.database().ref('users').child(uid).update({ wishList: updWishList })
        await dispatch('getInfo')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async deleteToWishList ({ dispatch, commit }, payload) {
      try {
        const uid = await dispatch('getUid')
        const updWishList = (await firebase.database().ref(`users/${uid}/wishList`).once('value')).val()
        const index = updWishList.findIndex(id => id === payload)
        updWishList.splice(index, 1)
        await firebase.database().ref('users').child(uid).update({ wishList: updWishList })
        await dispatch('getInfo')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async logOut ({ commit }) {
      await firebase.auth().signOut()
      commit('logOut')
    }
  }
}
