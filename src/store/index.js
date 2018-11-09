import Vue from 'vue'
import Vuex from 'vuex'

import application from './application'
import organisation from './organisation'
import form from './form'
import user from './user'
import organisationuser from './organisationuser'
import section from './section'
import question from './question'
import answer from './answer'
import submission from './submission'
import response from './response'
import validation from './validation'
import trigger from './trigger'
import meta from './meta'
import auth from './auth'
import shared from './shared'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    auth: auth,
    application: application,
    organisation: organisation,
    form: form,
    user: user,
    organisationuser: organisationuser,
    section: section,
    question: question,
    answer: answer,
    submission: submission,
    response: response,
    validation: validation,
    trigger: trigger,
    meta: meta,
    shared: shared
  }
})
