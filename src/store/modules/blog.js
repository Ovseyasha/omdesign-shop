import firebase from 'firebase/app'

export default {
  namespaced: true,
  state: {
    articles: []
  },
  getters: {
    articles (state) {
      return state.articles
    },
    articleById: state => id => {
      return state.articles.find(a => a.id === id)
    }
  },
  mutations: {
    create (state, payload) {
      state.articles.push(payload)
    },
    read (state, payload) {
      state.articles = payload
    },
    upadte (state, payload) {
      state.articles.forEach((a, i) => {
        if (a.id === payload.id) {
          state.articles[i] = payload
        }
      })
    },
    delete (state, { id }) {
      state.articles.forEach((a, i) => {
        if (a.id === id) {
          state.articles.splice(i, 1)
        }
      })
    }
  },
  actions: {
    async create ({ commit }, payload) {
      try {
        const article = await firebase.database().ref('blog').push(payload)
        for (let i = 0; i < payload.media.length; i++) {
          if (typeof (payload.media[i].img) !== 'string') {
            const slideName = Math.random() + payload.media[i].img.name
            const slideFile = payload.media[i].img
            const storagesSlide = await firebase.storage().ref(`blog/${article.key}/media/${slideName}`).put(slideFile)
            const slideUrl = await storagesSlide.ref.getDownloadURL()
            const title = payload.media[i].title
            payload.media[i].fileName = slideName
            await firebase.database().ref(`blog/${article.key}/media/${i}`).update({ img: slideUrl, title: title, fileName: slideName })
          }
        }
        commit('create', payload)
      } catch (error) {
        console.log(error)
      }
    },
    async read ({ commit }) {
      try {
        const blog = (await firebase.database().ref('blog').once('value')).val()
        const nBlog = []
        if (blog !== null) {
          Object.keys(blog).forEach(key => {
            const c = blog[key]
            nBlog.push({
              ...c,
              id: key
            })
          })
        }
        commit('read', nBlog)
      } catch (error) {
        console.log(error)
      }
    },
    async update ({ commit }, { article, deletedName }) {
      try {
        if (deletedName.length > 0) {
          for (let i = 0; i < deletedName.length; i++) {
            const storage = firebase.storage()
            const storageRef = storage.ref()
            const desertRef = storageRef.child(`blog/${article.id}/media/${deletedName[i]}`)
            await desertRef.delete()
          }
        }
        for (let i = 0; i < article.media.length; i++) {
          if (typeof (article.media[i].img) !== 'string') {
            const slideName = Math.random() + article.media[i].fileName
            const slideFile = article.media[i].img
            const storagesSlide = await firebase.storage().ref(`blog/${article.id}/media/${slideName}`).put(slideFile)
            const slideUrl = await storagesSlide.ref.getDownloadURL()
            article.media[i].img = slideUrl
            article.media[i].fileName = slideName
          }
        }
        await firebase.database().ref('blog').child(article.id).update(article)
        commit('update', { article })
      } catch (error) {
        console.log(error)
      }
    },
    async delete ({ commit }, payload) {
      try {
        const id = payload.id
        payload.media.forEach(async p => {
          await firebase.storage().ref().child(`blog/${id}/media/${p.fileName}`).delete()
        })
        await firebase.database().ref(`blog/${id}`).remove()
        commit('delete', { id })
      } catch (error) {
      }
    }
  }
}
