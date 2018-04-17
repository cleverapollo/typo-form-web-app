const API_URL = process.env.API_URL
const APPLICATION_URL = `${API_URL}application/`
const FORM_URL = `/form/`

export default {
  state: {
    loadedForms: {}
  },
  mutations: {
    setLoadedForms (state, payload) {
      state.loadedForms = payload
      let forms = Object.assign({}, state.loadedForms)
      forms[payload.applicationId] = payload.forms
      state.loadedForms = forms
    },
    createForm (state, payload) {
      state.loadedForms[payload.applicationId].push(payload.form)
    },
    updateForm (state, payload) {
      const form = state.loadedForms[payload.applicationId].find(form => {
        return form.id === payload.form.id
      })

      form.name = payload.form.name
      form.period_start = payload.form.period_start
      form.period_end = payload.form.period_end
      form.period_id = payload.form.period_id
    },
    deleteForm (state, payload) {
      state.loadedForms[payload.applicationId] = state.loadedForms[payload.applicationId].filter(e => {
        return e.id !== parseInt(payload.id)
      })
    }
  },
  actions: {
    loadForms ({commit}, applicationId) {
      commit('setLoading', true)
      window.axios.get(APPLICATION_URL + applicationId + FORM_URL)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              applicationId: applicationId,
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
    createForm ({commit, getters}, payload) {
      const form = {
        name: payload.name,
        period_start: payload.periodStart,
        period_end: payload.periodEnd,
        period_id: payload.periodId,
        show_progress: true
      }

      window.axios.post(APPLICATION_URL + payload.applicationId + FORM_URL, form)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              applicationId: payload.applicationId,
              form: response['data']['form']
            }
            commit('createForm', createObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    updateForm ({commit}, payload) {
      commit('setLoading', true)

      window.axios.put(APPLICATION_URL + payload.applicationId + FORM_URL + payload.id, {
        name: payload.name,
        period_start: payload.periodStart,
        period_end: payload.periodEnd,
        period_id: payload.periodId
      })
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              applicationId: payload.applicationId,
              form: response['data']['form']
            }
            commit('updateForm', updateObj)
          }
        )
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteForm ({commit}, payload) {
      commit('setLoading', true)
      window.axios.delete(APPLICATION_URL + payload.applicationId + FORM_URL + payload.id)
        .then(() => {
          commit('setLoading', false)
          commit('deleteForm', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  },
  getters: {
    loadedForms (state) {
      return (applicationId) => {
        if (!state.loadedForms[applicationId]) {
          return []
        }
        return state.loadedForms[applicationId].sort((formA, formB) => {
          return formA.id > formB.id
        })
      }
    },
    loadedForm (state) {
      return (applicationId, formId) => {
        if (!state.loadedForms[applicationId]) {
          return null
        }
        return state.loadedForms[applicationId].find((form) => {
          return form.id === formId
        })
      }
    }
  }
}
