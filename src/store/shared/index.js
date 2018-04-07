const API_URL = process.env.API_URL
const INVITATION_URL = `${API_URL}invitation/`
const JOIN_URL = `${API_URL}join/`
const QUESTION_TYPE_URL = `${API_URL}question-type/`
const ROLE_URL = `${API_URL}role/`
const PERIOD_URL = `${API_URL}period/`

export default {
  state: {
    loading: false,
    error: null,
    questionTypes: [],
    periods: [],
    roles: []
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
    setRoles (state, payload) {
      state.roles = payload
    },
    setPeriods (state, payload) {
      state.periods = payload
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
    periods (state) {
      return state.periods
    },
    roles (state) {
      return state.roles
    }
  }
}
