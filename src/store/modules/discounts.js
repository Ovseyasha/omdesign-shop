import firebase from 'firebase/app'
export default {
  namespaced: true,
  state: {
    discounts: []
  },
  getters: {
    getList (state) {
      return state.discounts
    },
    readById: state => id => {
      return state.discounts.find(d => d.id === id)
    }
  },
  mutations: {
    create (state, payload) {
      state.discounts.push(payload)
    },
    read (state, payload) {
      state.discounts = payload
    },
    update (state, { discount, id }) {
      state.discounts.forEach((d, i) => {
        if (d.id === id) {
          state.discounts[i] = discount
        }
      })
    },
    delete (state, { id }) {
      state.discounts.forEach((d, i) => {
        if (d.id === id) {
          state.discounts.splice(i, 1)
        }
      })
    }
  },
  actions: {
    async create ({ commit }, payload) {
      try {
        const discount = await firebase.database().ref('discounts').push(payload)
        if (typeof (payload.url) !== 'string') {
          const slideName = Math.random() + payload.url.name
          const slideFile = payload.url
          const storagesSlide = await firebase.storage().ref(`discounts/${discount.key}/${slideName}`).put(slideFile)
          const slideUrl = await storagesSlide.ref.getDownloadURL()
          payload.url = slideUrl
          payload.fileName = slideName
          await firebase.database().ref(`discounts/${discount.key}`).update({ url: slideUrl, fileName: slideName })
        }
        payload.id = discount.key
        commit('create', payload)
      } catch (error) {
        console.log(error)
      }
    },
    async read ({ commit }, payload) {
      try {
        const discounts = (await firebase.database().ref('discounts').once('value')).val()
        const ud = []
        if (discounts !== null) {
          Object.keys(discounts).forEach(key => {
            const s = discounts[key]
            ud.push({
              ...s,
              id: key
            })
          })
        }
        commit('read', ud)
      } catch (error) {
        console.log(error)
      }
    },
    async update ({ commit }, { discount, id }) {
      try {
        if (typeof (discount.url) === 'object') {
          await firebase.storage().ref().child(`discounts/${id}/${discount.fileName}`).delete()
        }
        if (typeof (discount.url) !== 'string') {
          const slideName = Math.random() + discount.url.name
          const slideFile = discount.url
          const storagesSlide = await firebase.storage().ref(`discounts/${id}/${slideName}`).put(slideFile)
          const slideUrl = await storagesSlide.ref.getDownloadURL()
          discount.url = slideUrl
          discount.fileName = slideName
        }
        await firebase.database().ref('discounts').child(id).update(discount)
        discount.id = id
        commit('update', { discount, id })
      } catch (error) {
        console.log(error)
      }
    },
    async delete ({ commit }, { discount, id }) {
      try {
        await firebase.storage().ref().child(`discounts/${id}/${discount.fileName}`).delete()
        await firebase.database().ref(`discounts/${id}`).remove()
        commit('delete', { discount, id })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
