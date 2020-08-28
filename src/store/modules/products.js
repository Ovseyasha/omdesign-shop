import firebase from 'firebase/app'
import store from '../index'
/* eslint-disable */
export default {
  namespaced: true,
  state: {
    products: [],
    myReviews: []
  },
  getters: {
    products (state) {
      return state.products
    },
    productById: state => id => {
      return state.products.find(product => product.id === id)
    },
    salesProducts (state) {
      return state.products.filter(product => product.oldPrice !== false)
    },
    lastProducts (state) {
      return state.products.filter(product => product.isNew === true)
    },
    productsByCategory: state => id => {
      return state.products.filter(product => {
        return product.category.id === id
      })
    },
    myReviews (state) {
      return state.myReviews
    }
  },
  mutations: {
    create () { },
    read (state, payload) {
      state.products = payload
    },
    update (state, { id, product }) {
      state.products.forEach((p, i) => {
        if (p.id === id) {
          state.products[i] = product
        }
      })
    },
    delete (state, { id }) {
      state.products.forEach((p, i) => {
        if (p.id === id) {
          state.products.splice(i, 1)
        }
      })
    },
    readReviewById (state, payload) {
      state.myReviews = payload
    }
  },
  actions: {
    async create ({ dispatch, commit }, payload) {
      try {
        const product = await firebase.database().ref('products').push(payload)
        for (let i = 0; i < payload.photos.length; i++) {
          if (typeof (payload.photos[i].img) !== 'string') {
            const slideName = Math.random() + payload.photos[i].img.name
            const slideFile = payload.photos[i].img
            const storagesSlide = await firebase.storage().ref(`products/${product.key}/slides/${slideName}`).put(slideFile)
            const slideUrl = await storagesSlide.ref.getDownloadURL()
            const title = payload.photos[i].title
            payload.photos[i].fileName = slideName
            await firebase.database().ref(`products/${product.key}/photos/${i}`).update({ img: slideUrl, title: title, fileName: slideName })
          }
        }
        await dispatch('read')
      } catch (error) {
        throw error
      }
    },
    async read ({ commit }, payload) {
      try {
        await store.dispatch('category/read')
        const products = (await firebase.database().ref('products').once('value')).val()
        const uProducts = []
        if (products !== null) {
          Object.keys(products).forEach(key => {
            if (typeof (products[key].category) === 'string') {
              const id = products[key].category
              products[key].category = store.getters['category/getCategoryName'](id)
            }
            const s = products[key]
            uProducts.push({
              ...s,
              id: key
            })
          })
        }
        // console.log(uProducts)
        commit('read', uProducts)
      } catch (error) {
      }
    },
    async update ({ commit }, { product, id, deletedName }) {
      try {
        if (deletedName.length > 0) {
          for (let i = 0; i < deletedName.length; i++) {
            const storage = firebase.storage()
            const storageRef = storage.ref()
            const desertRef = storageRef.child(`products/${id}/slides/${deletedName[i]}`)
            await desertRef.delete()
          }
        }
        for (let i = 0; i < product.photos.length; i++) {
          if (typeof (product.photos[i].img) !== 'string') {
            const slideName = Math.random() + product.photos[i].fileName
            const slideFile = product.photos[i].img
            const storagesSlide = await firebase.storage().ref(`products/${id}/slides/${slideName}`).put(slideFile)
            const slideUrl = await storagesSlide.ref.getDownloadURL()
            product.photos[i].img = slideUrl
            product.photos[i].fileName = slideName
          }
        }
        await firebase.database().ref('products').child(id).update(product)
        commit('update', { id, product })
      } catch (error) {
      }
    },
    async delete ({ commit }, { product }) {
      try {
        const id = product.id
        console.log(product.photos)
        product.photos.forEach(async p => {
          await firebase.storage().ref().child(`products/${id}/slides/${p.fileName}`).delete()
        })
        await firebase.database().ref(`products/${id}`).remove()
        commit('delete', { id })
      } catch (error) {
      }
    },
    // products feedback
    async createReview ({ commit, dispatch }, payload) {
      try {
        await store.dispatch('users/getInfo')
        const user = store.getters['users/info']
        const sendReview = {
          ...payload.review,
          userId: user.id,
          userName: user.name,
          userSurName: user.surName,
          userAvatar: user.avatar.url,
          likes: {},
          disLikes: {},
          date: new Date().toLocaleDateString()
        }
        const review = await firebase.database().ref(`products/${payload.id}/feedback`).push(sendReview)
        if (payload.review.photos !== null) {
          for (let i = 0; i < payload.review.photos.length; i++) {
            const slideName = Math.random() + payload.review.photos[i].img.name
            const slideFile = payload.review.photos[i].img
            const storagesSlide = await firebase.storage().ref(`products/${payload.id}/feedback/${review.key}/${slideName}`).put(slideFile)
            const slideUrl = await storagesSlide.ref.getDownloadURL()
            const title = payload.review.photos[i].title
            payload.review.photos[i].fileName = slideName
            await firebase.database().ref(`products/${payload.id}/feedback/${review.key}/photos/${i}`).update({
              img: slideUrl,
              title,
              fileName: slideName
            })
          }
        }
        await dispatch('read')
      } catch (error) {
      }
    },
    async readReviewById ({ commit }) {
      try {
        const id = await store.dispatch('users/getUid')
        const products = (await firebase.database().ref('products').orderByChild('feedback').once('value')).val()
        const reviews = []
        const arrProd = Object.values(products)
        arrProd.forEach(p => {
          if (p.feedback) {
            Object.values(p.feedback).forEach(r => {
              if (r.userId === id) {
                reviews.push(r)
              }
            })
          }
        })
        commit('readReviewById', reviews)
      } catch (error) {
      }
    },
    async likeReview ({ commit, dispatch }, payload) {
      try {
        const userId = await store.dispatch('users/getUid')
        const likes = (await firebase.database().ref(`products/${payload.prodId}/feedback/${payload.index}/likes`).once('value')).val() || {}
        const disLikes = (await firebase.database().ref(`products/${payload.prodId}/feedback/${payload.index}/disLikes`).once('value')).val() || {}

        if (payload.action === 'like') {
          for (const key in disLikes) {
            if (disLikes[key] === userId) {
              delete disLikes[key]
            }
          }
          if (Object.keys(likes).length) {
            Object.values(likes).forEach(async e => {
              if (e !== userId) {
                await firebase.database().ref(`products/${payload.prodId}/feedback/${payload.index}/likes`).push(userId)
              }
            })
          } else {
            await firebase.database().ref(`products/${payload.prodId}/feedback/${payload.index}/likes`).push(userId)
          }
          await firebase.database().ref(`products/${payload.prodId}/feedback/${payload.index}/disLikes`).set(disLikes)
        } else {
          for (const key in likes) {
            if (likes[key] === userId) {
              delete likes[key]
            }
          }
          if (Object.keys(disLikes).length) {
            Object.values(disLikes).forEach(async e => {
              if (e !== userId) {
                await firebase.database().ref(`products/${payload.prodId}/feedback/${payload.index}/disLikes`).push(userId)
              }
            })
          } else {
            await firebase.database().ref(`products/${payload.prodId}/feedback/${payload.index}/disLikes`).push(userId)
          }
          await firebase.database().ref(`products/${payload.prodId}/feedback/${payload.index}/likes`).set(likes)
        }
      } catch (error) {
      }
    }
  }
}
