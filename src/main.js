// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueAuthenticate from 'vue-authenticate'
import VueAxios from 'vue-axios'
import axios from 'axios'
import 'babel-polyfill'

import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import { store } from './store'

import AlertCmp from './components/Shared/Alert.vue'
import Terms from '@/components/Shared/Terms.vue'
import DeleteConfirmDialog from './components/Shared/DeleteConfirmDialog.vue'

import 'vuetify/dist/vuetify.min.css'
window.axios = require('axios')
const sanitizeHtml = require('sanitize-html')

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem('token')
    if (accessToken != null) {
      config.headers['API-Token'] = accessToken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      store.dispatch('logout')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

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
      redirectUri: process.env.REDIRECT_URL, // Your client app URL
      scope: ['wl.basic', 'wl.emails']
    }
  }
})
Vue.config.productionTip = false
Vue.prototype.$sanitize = sanitizeHtml

Vue.component('app-alert', AlertCmp)
Vue.component('Terms', Terms)
Vue.component('DeleteConfirmDialog', DeleteConfirmDialog)

/* eslint-disable no-new */
function createApp () {
  new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
  })
}

if (sessionStorage.getItem('token')) {
  store.dispatch('autoSignIn').finally(() => createApp())
} else {
  createApp()
}
