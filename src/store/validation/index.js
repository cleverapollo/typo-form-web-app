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
      validations[payload.formId] = payload.validations
      state.loadedValidations = validations
    },
    createValidation (state, payload) {
      let validations = Object.assign({}, state.loadedValidations)
      validations[payload.formId].push(payload.validation)
      state.loadedValidations = validations
    },
    updateValidation (state, payload) {
      let validations = Object.assign({}, state.loadedValidations)
      const index = validations[payload.formId].findIndex(validation => {
        return validation.id === payload.validation.id
      })
      validations[payload.formId].splice(index, 1, payload.validation)
      state.loadedValidations = validations
    },
    deleteValidation (state, payload) {
      let validations = Object.assign({}, state.loadedValidations)
      validations[payload.formId] = validations[payload.formId].filter(e => {
        return e.id !== payload.id
      })
      state.loadedValidations = validations
    }
  },
  actions: {
    loadValidations ({commit}, formId) {
      commit('setLoading', true)
      window.axios.get(FORM_URL + formId + VALIDATION_URL)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              formId: formId,
              validations: response['data']['validations']
            }
            commit('setLoadedValidations', createObj)
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
        question_id: payload.questionId,
        validation_type_id: payload.validationTypeId,
        validation_data: payload.validationData
      }
      window.axios.post(FORM_URL + payload.formId + VALIDATION_URL, validation)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              formId: payload.formId,
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
      const updateObj = {}
      if (payload.questionId) {
        updateObj.question_id = payload.questionId
      }
      if (payload.validationTypeId) {
        updateObj.validation_type_id = payload.validationTypeId
      }
      if (payload.validationData) {
        updateObj.validation_data = payload.validationData
      }
      window.axios.put(FORM_URL + payload.formId + VALIDATION_URL + payload.id, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formId: payload.formId,
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
      window.axios.delete(FORM_URL + payload.formId + VALIDATION_URL + payload.id)
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
      return (formId) => {
        if (!state.loadedValidations[formId]) {
          return []
        }
        return state.loadedValidations[formId]
      }
    },
    loadedValidation (state) {
      return (formId, validationId) => {
        if (!state.loadedValidations[formId]) {
          return null
        }
        return state.loadedValidations[formId].find((validation) => {
          return validation.id === validationId
        })
      }
    },
    loadedQuestionValidation (state) {
      return (formId, questionId) => {
        if (!state.loadedValidations[formId]) {
          return []
        }
        return state.loadedValidations[formId].filter((validation) => {
          return validation.question_id === questionId
        })
      }
    }
  }
}
