import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    namesFromUserAuthenticated: localStorage.getItem('names_user') || '',
    APP_URL: '',
  },
  mutations: {
    setNamesFromUserAuthenticated (state, namesFromUserAuthenticated) {
      state.namesFromUserAuthenticated = namesFromUserAuthenticated
    },
    setAPP_URL (state, APP_URL) {
      state.APP_URL = APP_URL
    }
  },
  actions: {
  },
  modules: {
  }
})
