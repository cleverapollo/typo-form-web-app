import Vue from 'vue'
import Vuex from 'vuex'

import application from './application'
import team from './team'
import form from './form'
import user from './user'
import teamuser from './teamuser'
import section from './section'
import question from './question'
import answer from './answer'
import submission from './submission'
import response from './response'
import validation from './validation'
import trigger from './trigger'
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
    teamuser: teamuser,
    section: section,
    question: question,
    answer: answer,
    submission: submission,
    response: response,
    validation: validation,
    trigger: trigger,
    shared: shared
  }
})
