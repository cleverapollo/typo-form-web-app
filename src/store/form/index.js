const API_URL = process.env.API_URL
const APPLICATION_URL = `${API_URL}application/`
const FORM_URL = `/form/`

export default {
  state: {
    loadedForms: []
  },
  mutations: {
    setLoadedForms (state, payload) {
      state.loadedForms = payload
    },
    createForm (state, payload) {
      state.loadedForms.push(payload)
    },
    updateForm (state, payload) {
      const form = state.loadedForms.find(form => {
        return form.applicationid === payload.applicationid && form.id === payload.id
      })
      if (payload.name) {
        form.name = payload.name
      }
    },
    deleteForm (state, payload) {
      state.loadedForms = state.loadedForms.filter(e => {
        return e.id !== payload.id || e.applicationid !== payload.applicationid
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
            commit('setLoadedForms', response['data']['forms'])
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
            commit('createForm', response['data']['form'])
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
        .then(response => {
          commit('setLoading', false)
          commit('updateForm', response['data']['form'])
        })
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
      return state.loadedForms.sort((formA, formB) => {
        return formA.id > formB.id
      })
    },
    loadedForm (state) {
      return (formid) => {
        return state.loadedForms.find((form) => {
          return form.id === formid
        })
      }
    }
  }
}
