import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    namesFromUserAuthenticated: localStorage.getItem('names_user') || '',
  },
  mutations: {
    setNamesFromUserAuthenticated (state, namesFromUserAuthenticated) {
      state.namesFromUserAuthenticated = namesFromUserAuthenticated
    },
  },
  actions: {
  },
  modules: {
  }
})
