// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import { store } from './store'
import AlertCmp from './components/Shared/Alert.vue'
import 'vuetify/dist/vuetify.min.css'
window.axios = require('axios')

Vue.use(Vuetify)
Vue.config.productionTip = false

Vue.component('app-alert', AlertCmp)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  beforeCreate () {
    if (localStorage.getItem('token')) {
      window.axios.defaults.headers.common['api_token'] = localStorage.getItem('token')
      this.$store.dispatch('autoSignIn', localStorage.getItem('token'))
    }
  }
})
