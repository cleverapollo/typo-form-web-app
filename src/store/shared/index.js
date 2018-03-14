const API_URL = process.env.API_URL
const INVITATION_URL = `${API_URL}invitation/`
const JOIN_URL = `${API_URL}join/`

export default {
  state: {
    loading: false,
    error: null
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
            commit('setError', error.response)
          }
        )
    },
    acceptJoin ({commit}, payload) {
      commit('setLoading', true)
      window.axios.post(JOIN_URL + payload.type + '/' + payload.token)
        .then(
          response => {
            commit('setLoading', false)
            commit('setUser', response['data']['user'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error.response)
          }
        )
    },
    clearError ({commit}) {
      commit('clearError')
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
    }
  }
}
