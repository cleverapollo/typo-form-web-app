// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import JsonExcel from 'vue-json-excel'
import VueQuillEditor from 'vue-quill-editor'
import axios from 'axios'

import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import { store } from './store'

import AlertCmp from './components/Shared/Alert'
import Snackbar from './components/Shared/Snackbar'
import Terms from './components/Shared/Terms'
import DuplicateConfirmDialog from './components/Shared/DuplicateConfirmDialog'
import DeleteConfirmDialog from './components/Shared/DeleteConfirmDialog'
import ParentSectionDialog from './components/Shared/ParentSectionDialog'
import FileUpload from './components/Shared/FileUpload.vue'
import ApplicationLoading from './components/Shared/ApplicationLoading.vue'
import DateRange from './components/Shared/DateRange.vue'

import 'vuetify/dist/vuetify.min.css'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

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

// Currently it seems core plugin requests role and a few other inaccessible resources making the
// password reset broken. This is a temporary fix, a whilelist of routes that don't trigger a
// redirect during a 401
const whitelist401 = [
  'NewPassword'
]

// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      if (whitelist401.indexOf(router.currentRoute.name) === -1) {
        store.dispatch('logout')
        router.push('/login')
      }
    }
    return Promise.reject(error)
  }
)
Vue.use(Vuetify)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
Vue.prototype.$sanitize = sanitizeHtml

Vue.component('app-alert', AlertCmp)
Vue.component('Snackbar', Snackbar)
Vue.component('Terms', Terms)
Vue.component('DeleteConfirmDialog', DeleteConfirmDialog)
Vue.component('DuplicateConfirmDialog', DuplicateConfirmDialog)
Vue.component('ParentSectionDialog', ParentSectionDialog)
Vue.component('FileUpload', FileUpload)
Vue.component('ApplicationLoading', ApplicationLoading)
Vue.component('downloadExcel', JsonExcel)
Vue.component('VDateRange', DateRange)

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
