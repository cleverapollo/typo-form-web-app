// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import { store } from './store'

import AlertCmp from './components/Shared/Alert.vue'

import EditEmail from './components/Auth/EditProfile/EditEmail.vue'
import EditPassword from './components/Auth/EditProfile/EditPassword.vue'

import EditApplication from './components/Application/EditApplication.vue'
import InviteApplication from './components/Application/InviteApplication.vue'

import EditTeam from './components/Team/EditTeam.vue'
import InviteTeam from './components/Team/InviteTeam.vue'

import EditUser from './components/User/EditUser.vue'

import EditForm from './components/Form/EditForm.vue'

import EditTeamUser from './components/Team/EditTeamUser.vue'

import CreateSection from './components/Section/CreateSection.vue'

import CreateQuestion from './components/Question/CreateQuestion.vue'

import CreateAnswer from './components/Answer/CreateAnswer.vue'

import 'vuetify/dist/vuetify.min.css'
window.axios = require('axios')

Vue.use(Vuetify)
Vue.config.productionTip = false

Vue.component('app-alert', AlertCmp)
Vue.component('app-edit-email', EditEmail)
Vue.component('app-edit-password', EditPassword)
Vue.component('app-edit-application', EditApplication)
Vue.component('app-invite-application', InviteApplication)
Vue.component('app-invite-team', InviteTeam)
Vue.component('app-edit-team', EditTeam)
Vue.component('app-edit-user', EditUser)
Vue.component('app-edit-form', EditForm)
Vue.component('app-edit-teamuser', EditTeamUser)
Vue.component('app-create-section', CreateSection)
Vue.component('app-create-question', CreateQuestion)
Vue.component('app-create-answer', CreateAnswer)

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
      this.$store.dispatch('autoSignIn')
    }
  }
})
