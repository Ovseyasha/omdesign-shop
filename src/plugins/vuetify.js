import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#4D6A00',
        secondary: '#A0C601',
        accent: '#EDEDED',
        error: '#F57F6C',
        info: '#ACACAC',
        success: '#A0C601',
        warning: '#FFC107'
      }
    }
  }
})
