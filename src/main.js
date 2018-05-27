// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueAuthenticate from 'vue-authenticate'
import VueAxios from 'vue-axios'
import axios from 'axios'

import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import { store } from './store'

import AlertCmp from './components/Shared/Alert.vue'

import 'vuetify/dist/vuetify.min.css'
window.axios = require('axios')

Vue.use(Vuetify)
Vue.use(VueAxios, axios)
Vue.use(VueAuthenticate, {
  tokenName: 'access_token',
  baseUrl: process.env.API_ORIGIN_URL,
  storageType: 'cookieStorage',
  providers: {
    // Define OAuth providers config
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      redirectUri: process.env.REDIRECT_URL // Your client app URL
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      redirectUri: process.env.REDIRECT_URL // Your client app URL
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      redirectUri: process.env.REDIRECT_URL // Your client app URL
    },
    live: {
      clientId: process.env.LIVE_CLIENT_ID,
      redirectUri: process.env.REDIRECT_URL // Your client app URL
    }
  }
})
Vue.config.productionTip = false

Vue.component('app-alert', AlertCmp)

/* eslint-disable no-new */
function createApp () {
  new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>',
    // Attach the Vue instance to the window,
    // so it's available globally.
    created: function () {
      window.Vue = this
    }
  })
}

if (localStorage.getItem('token')) {
  window.axios.defaults.headers.common['api_token'] = localStorage.getItem('token')
  store.dispatch('autoSignIn').finally(() => createApp())
} else {
  createApp()
}
