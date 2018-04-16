const API_URL = process.env.API_URL
const FORM_URL = `${API_URL}form/`
const VALIDATION_URL = '/validation/'

export default {
  state: {
    loadedValidations: []
  },
  mutations: {
    setLoadedValidations (state, payload) {
      let validations = Object.assign({}, state.loadedValidations)
      validations[payload.formid] = payload.validations
      state.loadedValidations = validations
    },
    createValidation (state, payload) {
      state.loadedValidations[payload.formid].push(payload.validation)
    },
    updateValidation (state, payload) {
      const index = state.loadedValidations[payload.formid].findIndex(validation => {
        return validation.id === payload.validation.id
      })
      state.loadedValidations[payload.formid].splice(index, 1, payload.validation)
    },
    deleteValidation (state, payload) {
      state.loadedValidations[payload.formid] = state.loadedValidations[payload.formid].filter(e => {
        return e.id !== payload.id
      })
    }
  },
  actions: {
    loadValidations ({commit}, formid) {
      commit('setLoading', true)
      window.axios.get(FORM_URL + formid + VALIDATION_URL)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formid: formid,
              validations: response['data']['validations']
            }
            commit('setLoadedValidations', updateObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    createValidation ({commit, getters}, payload) {
      let validation = {
        question_id: payload.question_id,
        validation_type_id: payload.validation_type_id,
        validation_data: payload.validation_data
      }
      window.axios.post(FORM_URL + payload.formid + VALIDATION_URL, validation)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              formid: payload.formid,
              validation: response['data']['validation']
            }
            commit('createValidation', createObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    updateValidation ({commit}, payload) {
      commit('setLoading', true)
      window.axios.put(FORM_URL + payload.formid + VALIDATION_URL + payload.id, payload)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formid: payload.formid,
              validation: response['data']['validation']
            }
            commit('updateValidation', updateObj)
          }
        )
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteValidation ({commit}, payload) {
      commit('setLoading', true)
      window.axios.delete(FORM_URL + payload.formid + VALIDATION_URL + payload.id)
        .then(() => {
          commit('setLoading', false)
          commit('deleteValidation', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  },
  getters: {
    loadedValidations (state) {
      return (formid) => {
        if (!state.loadedValidations[formid]) {
          return []
        }
        return state.loadedValidations[formid]
      }
    },
    loadedValidation (state) {
      return (formid, validationid) => {
        if (!state.loadedValidations[formid]) {
          return null
        }
        return state.loadedValidations[formid].find((validation) => {
          return validation.id === validationid
        })
      }
    },
    loadedQuestionValidation (state) {
      return (formid, questionid) => {
        if (!state.loadedValidations[formid]) {
          return []
        }
        return state.loadedValidations[formid].filter((validation) => {
          return validation.question_id === questionid
        })
      }
    }
  }
}
