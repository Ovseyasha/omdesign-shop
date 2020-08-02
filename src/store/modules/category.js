export default {
  namespaced: true,
  state: {
    categories: [
      {
        id: 1,
        name: 'Футболки'
      },
      {
        id: 2,
        name: 'Сумки'
      },
      {
        id: 3,
        name: 'Подушки'
      },
      {
        id: 4,
        name: 'Кружки'
      },
      {
        id: 5,
        name: 'Холсты'
      },
      {
        id: 6,
        name: 'Постеры'
      },
      {
        id: 7,
        name: 'Шторы для душа'
      }
    ]
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
  mutations: {},
  actions: {}
}
