const API_URL = process.env.API_URL
const APPLICATION_URL = `${API_URL}application/`
const FORM_URL = `/form/`
const SETTING_URL = `auto/`

export default {
  state: {
    loadedForms: {}
  },
  mutations: {
    setLoadedForms (state, payload) {
      let forms = Object.assign({}, state.loadedForms)
      forms[payload.slug] = payload.forms
      state.loadedForms = forms
    },
    createForm (state, payload) {
      let forms = Object.assign({}, state.loadedForms)
      forms[payload.slug].push(payload.form)
      state.loadedForms = forms
    },
    updateForm (state, payload) {
      let forms = Object.assign({}, state.loadedForms)
      const index = forms[payload.slug].findIndex(form => {
        return form.id === payload.form.id
      })
      forms[payload.slug].splice(index, 1, payload.form)
      state.loadedForms = forms
    },
    deleteForm (state, payload) {
      let forms = Object.assign({}, state.loadedForms)
      forms[payload.slug] = forms[payload.slug].filter(e => {
        return e.id !== payload.id
      })
      state.loadedForms = forms
    },
    setAuto (state, payload) {
      let forms = Object.assign({}, state.loadedForms)
      for (let i = 0; i < forms[payload.slug].length; i++) {
        if (payload.formIds.includes(forms[payload.slug][i].id)) {
          forms[payload.slug][i].auto = 1
        } else {
          forms[payload.slug][i].auto = 0
        }
      }
      state.loadedForms = forms
    }
  },
  actions: {
    loadForms ({commit}, slug) {
      commit('setLoading', true)
      window.axios.get(APPLICATION_URL + slug + FORM_URL)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              slug: slug,
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
      window.axios.post(APPLICATION_URL + payload.slug + FORM_URL, form)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              slug: payload.slug,
              form: response['data']['form']
            }
            commit('createForm', createObj)
          }
        ).catch(function () {
          commit('setLoading', false)
        })
    },
    updateForm ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.name) {
        updateObj.name = payload.name
      }
      if (payload.showProgress) {
        updateObj.show_progress = payload.showProgress
      }

      /*
      let formData = new FormData()

      if (payload.csv) {
        formData.append('csv', payload.csv)
      }

      const config = {
        headers: {'content-type': 'multipart/form-data'}
      } */

      window.axios.put(APPLICATION_URL + payload.slug + FORM_URL + payload.id, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              slug: payload.slug,
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
      window.axios.delete(APPLICATION_URL + payload.slug + FORM_URL + payload.id)
        .then(() => {
          commit('setLoading', false)
          commit('deleteForm', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    setAuto ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {
        form_ids: payload.formIds
      }
      window.axios.post(APPLICATION_URL + payload.slug + FORM_URL + SETTING_URL, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              slug: payload.slug,
              formIds: payload.formIds
            }
            commit('setAuto', updateObj)
          }
        )
        .catch(
          error => {
            console.log(error)
            commit('setLoading', false)
          }
        )
    }
  },
  getters: {
    loadedForms (state) {
      return (slug) => {
        if (!state.loadedForms[slug]) {
          return []
        }
        return state.loadedForms[slug].sort((formA, formB) => {
          return formA.id > formB.id
        })
      }
    },
    loadedForm (state) {
      return (slug, formId) => {
        if (!state.loadedForms[slug]) {
          return null
        }
        return state.loadedForms[slug].find((form) => {
          return form.id === formId
        })
      }
    }
  }
}
