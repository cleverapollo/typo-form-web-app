const API_URL = process.env.API_URL
const APPLICATION_URL = `${API_URL}application/`
const FORM_URL = `/form/`

export default {
  state: {
    loadedForms: {}
  },
  mutations: {
    setLoadedForms (state, payload) {
      let forms = Object.assign({}, state.loadedForms)
      forms[payload.applicationName] = payload.forms
      state.loadedForms = forms
    },
    createForm (state, payload) {
      let forms = Object.assign({}, state.loadedForms)
      forms[payload.applicationName].push(payload.form)
      state.loadedForms = forms
    },
    updateForm (state, payload) {
      let forms = Object.assign({}, state.loadedForms)
      const index = forms[payload.applicationName].findIndex(form => {
        return form.id === payload.form.id
      })
      forms[payload.applicationName].splice(index, 1, payload.form)
      state.loadedForms = forms
    },
    deleteForm (state, payload) {
      let forms = Object.assign({}, state.loadedForms)
      forms[payload.applicationName] = forms[payload.applicationName].filter(e => {
        return e.id !== payload.id
      })
      state.loadedForms = forms
    }
  },
  actions: {
    loadForms ({commit}, applicationName) {
      commit('setLoading', true)
      window.axios.get(APPLICATION_URL + applicationName + FORM_URL)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              applicationName: applicationName,
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
        show_progress: payload.showProgress
      }

      window.axios.post(APPLICATION_URL + payload.applicationName + FORM_URL, form)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              applicationName: payload.applicationName,
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
      const updateObj = {}
      if (payload.name) {
        updateObj.name = payload.name
      }
      if (payload.periodStart) {
        updateObj.period_start = payload.periodStart
      }
      if (payload.periodEnd) {
        updateObj.period_end = payload.periodEnd
      }
      if (payload.periodId) {
        updateObj.period_id = payload.periodId
      }
      if (payload.showProgress) {
        updateObj.show_progress = payload.showProgress
      }

      window.axios.put(APPLICATION_URL + payload.applicationName + FORM_URL + payload.id, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              applicationName: payload.applicationName,
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
      window.axios.delete(APPLICATION_URL + payload.applicationName + FORM_URL + payload.id)
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
      return (applicationName) => {
        if (!state.loadedForms[applicationName]) {
          return []
        }
        return state.loadedForms[applicationName].sort((formA, formB) => {
          return formA.id > formB.id
        })
      }
    },
    loadedForm (state) {
      return (applicationName, formId) => {
        if (!state.loadedForms[applicationName]) {
          return null
        }
        return state.loadedForms[applicationName].find((form) => {
          return form.id === formId
        })
      }
    }
  }
}
