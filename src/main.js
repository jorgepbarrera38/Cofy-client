import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import toastr from 'toastr'
import VModal from 'vue-js-modal'
import vSelect from 'vue-select'
import moment from 'moment'
import Croppa from 'vue-croppa'
import _ from 'underscore'

Vue.prototype.$_ = _


Vue.prototype.$hasPermission = (permission) => {
  let permissionsFromUser = localStorage.getItem('permissions') ? JSON.parse(localStorage.getItem('permissions')) : []
  return permissionsFromUser.filter(permissionFromUser => permissionFromUser.name == permission).length
}

Vue.use(Croppa)   

moment.locale('es')
Vue.prototype.$moment = moment

Vue.component('v-select', vSelect)
import 'vue-select/dist/vue-select.css';

Vue.use(VModal)

require('toastr/build/toastr.min.css')
toastr.options = {
  "positionClass": "toast-bottom-right",
}
Vue.prototype.$toastr = toastr

let production = false

if (production) {
  axios.defaults.baseURL = '/api'
} else {
  axios.defaults.baseURL = 'http://localhost:8000/api'
}

axios.get('configs').then( response => {
  store.commit('setAPP_URL', response.data.APP_URL)
})

Vue.prototype.$http = axios


if (localStorage.getItem('access_token')) {
  axios.defaults.headers.common['Authorization'] = `bearer ${ localStorage.getItem('access_token') }`
}

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.response.status == 401 && router.history.current.name != 'login') {
    localStorage.removeItem('access_token')
    localStorage.removeItem('names_user')
    localStorage.removeItem('nameCompany')
    localStorage.removeItem('permissions')
    toastr.info('Debe autenticarse')
    router.push({ name: 'login' })
  }

  if (error.response.status == 403) {
    toastr.error('No tiene permisos para esta acción')
  }

  return Promise.reject(error);
});

router.beforeEach((to, from, next) => {
  if (to.name == 'login' && localStorage.getItem('access_token')) {
    next({ name: 'dashboard' })
  } else if (to.name != 'login' &&  !localStorage.getItem('access_token')) {
    next({ name: 'login' })
  } else {
    next()
  }
})

Vue.component('pagination', require('laravel-vue-pagination'));

Vue.prototype.$formatNum = require('format-num')



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
