const API_URL = process.env.API_URL
const INVITATION_URL = `${API_URL}invitation/`
const JOIN_URL = `${API_URL}join/`
const QUESTION_TYPE_URL = `${API_URL}question-type/`
const ROLE_URL = `${API_URL}role/`
const PERIOD_URL = `${API_URL}period/`
const STATUS_URL = `${API_URL}status/`
const VALIDATION_TYPE_URL = `${API_URL}validation-type/`
const COMPARATOR_URL = `${API_URL}comparator/`
const TRIGGER_TYPE_URL = `${API_URL}trigger-type/`

export default {
  state: {
    loading: false,
    error: null,
    questionTypes: [],
    validationTypes: [],
    periods: [],
    roles: [],
    statuses: [],
    comparators: [],
    triggerTypes: []
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    setQuestionTypes (state, payload) {
      state.questionTypes = payload
    },
    setValidationTypes (state, payload) {
      state.validationTypes = payload
    },
    setRoles (state, payload) {
      state.roles = payload
    },
    setPeriods (state, payload) {
      state.periods = payload
    },
    setStatuses (state, payload) {
      state.statuses = payload
    },
    setComparators (state, payload) {
      state.comparators = payload
    },
    setTriggerTypes (state, payload) {
      state.triggerTypes = payload
    }
  },
  actions: {
    acceptInvitation ({commit}, payload) {
      commit('setLoading', true)
      window.axios.post(INVITATION_URL + payload.type + '/' + payload.token)
        .then(
          response => {
            commit('setLoading', false)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error.response.data)
          }
        )
    },
    acceptJoin ({commit}, payload) {
      commit('setLoading', true)
      window.axios.post(JOIN_URL + payload.type + '/' + payload.token)
        .then(
          response => {
            commit('setLoading', false)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error.response.data)
          }
        )
    },
    clearError ({commit}) {
      commit('clearError')
    },
    loadQuestionTypes ({commit}) {
      commit('setLoading', true)
      window.axios.get(QUESTION_TYPE_URL)
        .then(
          response => {
            commit('setLoading', false)
            commit('setQuestionTypes', response['data']['question_types'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    loadValidationTypes ({commit}) {
      commit('setLoading', true)
      window.axios.get(VALIDATION_TYPE_URL)
        .then(
          response => {
            commit('setLoading', false)
            commit('setValidationTypes', response['data']['validation_types'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    loadRoles ({commit}) {
      commit('setLoading', true)
      window.axios.get(ROLE_URL)
        .then(
          response => {
            commit('setLoading', false)
            commit('setRoles', response['data']['roles'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    loadPeriods ({commit}) {
      commit('setLoading', true)
      window.axios.get(PERIOD_URL)
        .then(
          response => {
            commit('setLoading', false)
            commit('setPeriods', response['data']['periods'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    loadStatuses ({commit}) {
      commit('setLoading', true)
      window.axios.get(STATUS_URL)
        .then(
          response => {
            commit('setLoading', false)
            commit('setStatuses', response['data']['statuses'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    loadComparators ({commit}) {
      commit('setLoading', true)
      window.axios.get(COMPARATOR_URL)
        .then(
          response => {
            commit('setLoading', false)
            commit('setComparators', response['data']['comparators'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    loadTriggerTypes ({commit}) {
      commit('setLoading', true)
      window.axios.get(TRIGGER_TYPE_URL)
        .then(
          response => {
            commit('setLoading', false)
            commit('setTriggerTypes', response['data']['trigger_types'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    error (state) {
      let errorMessage = state.error
      if (errorMessage && !errorMessage.message) {
        let errorString = []
        for (let key in errorMessage) {
          errorString.push(errorMessage[key])
        }
        errorMessage.message = errorString.join('<br>')
      }
      return errorMessage
    },
    questionTypes (state) {
      return state.questionTypes
    },
    validationTypes (state) {
      return state.validationTypes
    },
    periods (state) {
      return state.periods
    },
    roles (state) {
      return state.roles
    },
    statuses (state) {
      return state.statuses
    },
    comparators (state) {
      return state.comparators
    },
    triggerTypes (state) {
      return state.triggerTypes
    }
  }
}
