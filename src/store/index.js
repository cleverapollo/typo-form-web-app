import Vue from 'vue'
import Vuex from 'vuex'

import application from './application'
import team from './team'
import form from './form'
import user from './user'
import auth from './auth'
import shared from './shared'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    auth: auth,
    application: application,
    team: team,
    form: form,
    user: user,
    shared: shared
  }
})
