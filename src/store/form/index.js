const API_URL = process.env.API_URL
const FORM_TEMPLATE_URL = `${API_URL}form-builder/`
const APPLICATION_URL = `${API_URL}application/`
const FORM_URL = '/form'

export default {
  state: {
    loadedForms: {},
    loadedFormFilters: {}
  },
  mutations: {
    setLoadedForms (state, payload) {
      let forms = Object.assign({}, state.loadedForms)
      forms[payload.formTemplateId] = payload.forms
      state.loadedForms = forms
    },
    formFilter (state, payload) {
      state.loadedFormFilters = payload
    },
    setLoadedAllForms (state, payload) {
      let forms = Object.assign({}, state.loadedForms)
      for (let i = 0; i < payload.forms.length; i++) {
        const form = payload.forms[i]
        forms[form.form_template.id] = []
      }
      for (let i = 0; i < payload.forms.length; i++) {
        const form = payload.forms[i]
        forms[form.form_template.id].push(form)
      }
      state.loadedForms = forms
    },
    createForm (state, payload) {
      let forms = Object.assign({}, state.loadedForms)
      if (!forms[payload.formTemplateId]) {
        forms[payload.formTemplateId] = []
      }
      forms[payload.formTemplateId].push(payload.form)
      state.loadedForms = forms
    },
    updateForm (state, payload) {
      let forms = Object.assign({}, state.loadedForms)
      if (!forms[payload.formTemplateId]) {
        forms[payload.formTemplateId] = []
      }
      const index = forms[payload.formTemplateId].findIndex(form => {
        return form.id === payload.form.id
      })
      if (index != null) {
        forms[payload.formTemplateId].splice(index, 1, payload.form)
      } else {
        forms[payload.formTemplateId].push(payload.form)
      }
      state.loadedForms = forms
    },
    deleteForm (state, payload) {
      let forms = Object.assign({}, state.loadedForms)
      forms[payload.formTemplateId] = forms[payload.formTemplateId].filter(e => {
        return e.id !== payload.id
      })
      state.loadedForms = forms
    },
    setLoadedResponses (state, payload) {
      let forms = Object.assign({}, state.loadedForms)
      const form = forms[payload.formTemplateId].find((form) => {
        return form.id === payload.formId
      })
      form.responses = payload.responses
      state.loadedForms = forms
    },
    createResponse (state, payload) {
      let forms = Object.assign({}, state.loadedForms)
      const form = forms[payload.formTemplateId].find((form) => {
        return form.id === payload.formId
      })
      form.responses.push(payload.response)
      state.loadedForms = forms
    },
    updateResponse (state, payload) {
      let forms = Object.assign({}, state.loadedForms)
      const form = forms[payload.formTemplateId].find((form) => {
        return form.id === payload.formId
      })
      const index = form.responses.findIndex(response => {
        return response.id === payload.oldId
      })
      form.responses.splice(index, 1, payload.response)
      state.loadedForms = forms
    },
    deleteResponse (state, payload) {
      let forms = Object.assign({}, state.loadedForms)
      const form = forms[payload.formTemplateId].find((form) => {
        return form.id === payload.formId
      })
      form.responses = form.responses.filter(e => {
        return e.id !== payload.id
      })
      state.loadedForms = forms
    }
  },
  actions: {
    loadedForms ({commit}, formTemplateId) {
      commit('setLoading', true)
      window.axios.get(FORM_TEMPLATE_URL + formTemplateId + FORM_URL)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formTemplateId: formTemplateId,
              forms: response['data']['forms']
            }
            commit('setLoadedForms', updateObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    loadAllForm ({commit}, payload) {
      commit('setLoading', true)
      return new Promise((resolve, reject) => {
        window.axios.get(APPLICATION_URL + payload.slug + FORM_URL + '/' + payload.id)
          .then(
            response => {
              commit('setLoading', false)
              const updateObj = {
                formTemplateId: response['data']['form']['form_template']['id'],
                form: response['data']['form']
              }
              commit('updateForm', updateObj)
              resolve(response)
            }
          )
          .catch(
            error => {
              commit('setLoading', false)
              reject(error)
            }
          )
      })
    },
    loadAllForms ({commit}, slug) {
      commit('setLoading', true)
      return new Promise((resolve, reject) => {
        window.axios.get(APPLICATION_URL + slug + FORM_URL)
          .then(
            response => {
              commit('setLoading', false)
              const updateObj = {
                forms: response['data']['forms']
              }
              commit('setLoadedAllForms', updateObj)
              resolve(response)
            }
          )
          .catch(
            error => {
              commit('setLoading', false)
              reject(error)
            }
          )
      })
    },
    createForm ({commit, getters}, payload) {
      let form = {
        period_start: payload.periodStart,
        period_end: payload.periodEnd
      }

      if (payload.userId) {
        form.user_id = payload.userId
      }

      if (payload.organisationId) {
        form.organisation_id = payload.organisationId
      }

      return new Promise((resolve, reject) => {
        window.axios.post(FORM_TEMPLATE_URL + payload.formTemplateId + FORM_URL, form)
          .then(
            response => {
              commit('setLoading', false)
              const createObj = {
                formTemplateId: payload.formTemplateId,
                form: response['data']['form']
              }
              resolve(response)
              commit('createForm', createObj)
            }
          )
          .catch(
            error => {
              commit('setLoading', false)
              console.log(error)
            }
          )
      })
    },
    updateForm ({commit}, payload) {
      commit('setLoading', true)

      let form = {
        organisation_id: payload.organisationId,
        user_id: payload.userId
      }

      if (payload.statusId) {
        form.status_id = payload.statusId
      }

      if (payload.periodStart) {
        form.period_start = payload.periodStart
      }

      if (payload.periodEnd) {
        form.period_end = payload.periodEnd
      }

      if (payload.progress !== undefined) {
        form.progress = parseInt(payload.progress)
      }

      return new Promise((resolve, reject) => {
        window.axios.put(FORM_TEMPLATE_URL + payload.formTemplateId + FORM_URL + '/' + payload.id, form)
          .then(
            response => {
              commit('setLoading', false)
              const updateObj = {
                formTemplateId: payload.formTemplateId,
                form: response['data']['form']
              }
              commit('updateForm', updateObj)
              resolve(response)
            }
          )
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
            reject(error)
          })
      })
    },
    duplicateForm ({commit}, payload) {
      commit('setLoading', true)
      return new Promise((resolve, reject) => {
        window.axios.post(FORM_TEMPLATE_URL + payload.formTemplateId + FORM_URL + '/' + payload.id)
          .then(
            response => {
              commit('setLoading', false)
              const createdObj = {
                formTemplateId: payload.formTemplateId,
                form: response['data']['form']
              }
              commit('createForm', createdObj)
              resolve(response)
            }
          )
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
            reject(error)
          })
      })
    },
    deleteForm ({commit}, payload) {
      commit('setLoading', true)
      return new Promise((resolve, reject) => {
        window.axios.delete(FORM_TEMPLATE_URL + payload.formTemplateId + FORM_URL + '/' + payload.id)
          .then((response) => {
            commit('setLoading', false)
            commit('deleteForm', payload)
            resolve(response)
          })
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
            reject(error)
          })
      })
    },
    formFilter ({commit}, payload) {
      commit('setLoading', true)
      return new Promise((resolve, reject) => {
        window.axios.post(APPLICATION_URL + payload.slug + FORM_URL + '/filter', payload)
          .then((response) => {
            commit('setLoading', false)
            commit('formFilter', response['data']['forms'])
            resolve(response.data.forms)
          })
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
            reject(error)
          })
      })
    }
  },
  getters: {
    loadedForms (state) {
      return (formTemplateId) => {
        if (!state.loadedForms[formTemplateId]) {
          return []
        }

        return state.loadedForms[formTemplateId]
      }
    },
    loadedAllForms (state, getters, rootState) {
      return (slug) => {
        let forms = []
        const formTemplates = rootState.formTemplate.loadedFormTemplates[slug]
        if (!formTemplates) {
          return []
        }
        for (var i = 0; i < formTemplates.length; i++) {
          if (state.loadedForms[formTemplates[i].id]) {
            forms = forms.concat(state.loadedForms[formTemplates[i].id])
          }
        }
        return forms
      }
    },
    loadedApplicationForm (state, getters, rootState) {
      return (slug, formId) => {
        const formTemplates = rootState.formTemplate.loadedFormTemplates[slug]
        if (!formTemplates) {
          return null
        }
        for (var i = 0; i < formTemplates.length; i++) {
          if (state.loadedForms[formTemplates[i].id]) {
            const form = state.loadedForms[formTemplates[i].id].find((form) => {
              return form.id === formId
            })
            if (form) {
              return form
            }
          }
        }
        return null
      }
    },
    loadedFormFilters (state) {
      return () => {
        return state.loadedFormFilters
      }
    },
    loadedForm (state) {
      return (formTemplateId, formId) => {
        if (!state.loadedForms[formTemplateId]) {
          return null
        }

        return state.loadedForms[formTemplateId].find((form) => {
          return form.id === formId
        })
      }
    },
    loadedFormOrganisations (state, getters, rootState) {
      return (slug, formTemplateId) => {
        if (!rootState.organisation.loadedOrganisations[slug]) {
          return []
        }

        let organisations = rootState.organisation.loadedOrganisations[slug].slice(0)
        organisations.push({id: 0, name: 'No Organisation'})
        const forms = state.loadedForms[formTemplateId]
        if (forms) {
          for (var i = 0; i < forms.length; i++) {
            organisations = organisations.filter((organisation) => {
              if (!forms[i].organisation) {
                return organisation.id !== 0
              } else {
                return forms[i].organisation.name !== organisation.name
              }
            })
          }
        }
        return organisations
      }
    }
  }
}
