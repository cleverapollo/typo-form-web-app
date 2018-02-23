const API_URL = 'http://localhost:8000/api/'
const SIGNUP_URL = `${API_URL}register`
const SIGNIN_URL = `${API_URL}login`
const SIGNOUT_URL = `${API_URL}logout`
const USERINFO_URL = `${API_URL}userinfo`

export default {
  state: {
    user: null
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      window.axios.post(SIGNUP_URL, payload)
        .then(
          window.axios.post(SIGNIN_URL, payload)
            .then(
              response => {
                commit('setLoading', false)
                commit('setUser', response['data']['user'])
                localStorage.setItem('token', response['data']['user'])
              }
            )
            .catch(
              error => {
                commit('setLoading', false)
                commit('setError', error)
                console.log(error)
              }
            )
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      window.axios.post(SIGNIN_URL, payload)
        .then(
          response => {
            commit('setLoading', false)
            commit('setUser', response['data']['user'])
            localStorage.setItem('token', response['data']['user']['api_token'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    autoSignIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      window.axios.get(USERINFO_URL)
        .then(
          response => {
            commit('setLoading', false)
            commit('setUser', response['data']['user'])
            localStorage.setItem('token', response['data']['user']['api_token'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    logout ({commit}) {
      window.axios.post(SIGNOUT_URL)
      commit('setUser', null)
      localStorage.removeItem('token')
    }
  },
  getters: {
    user (state) {
      return state.user
    }
  }
}
