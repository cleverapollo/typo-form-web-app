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
      forms[payload.applicationid] = payload.forms
      state.loadedForms = forms
    },
    createForm (state, payload) {
      state.loadedForms[payload.applicationid].push(payload.form)
    },
    updateForm (state, payload) {
      const form = state.loadedForms[payload.applicationid].find(form => {
        return form.id === payload.form.id
      })
      if (payload.form.name) {
        form.name = payload.form.name
      }
    },
    deleteForm (state, payload) {
      state.loadedForms[payload.applicationid] = state.loadedForms[payload.applicationid].filter(e => {
        return e.id !== payload.id
      })
    }
  },
  actions: {
    loadForms ({commit}, applicationid) {
      commit('setLoading', true)
      window.axios.get(APPLICATION_URL + applicationid + FORM_URL)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              applicationid: applicationid,
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
        name: payload.name
      }
      window.axios.post(APPLICATION_URL + payload.applicationid + FORM_URL, form)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              applicationid: payload.applicationid,
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
      window.axios.put(APPLICATION_URL + payload.applicationid + FORM_URL + payload.id, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              applicationid: payload.applicationid,
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
      window.axios.delete(APPLICATION_URL + payload.applicationid + FORM_URL + payload.id)
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
      return (applicationid) => {
        if (!state.loadedForms[applicationid]) {
          return []
        }
        return state.loadedForms[applicationid].sort((formA, formB) => {
          return formA.id > formB.id
        })
      }
    },
    loadedForm (state) {
      return (applicationid, formid) => {
        if (!state.loadedForms[applicationid]) {
          return null
        }
        return state.loadedForms[applicationid].find((form) => {
          return form.id === formid
        })
      }
    }
  }
}
