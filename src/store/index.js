import Vue from 'vue'
import Vuex from 'vuex'

import team from './team'
import user from './user'
import shared from './shared'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    team: team,
    user: user,
    shared: shared
  }
})
