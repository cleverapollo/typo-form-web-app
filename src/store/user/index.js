const API_URL = process.env.API_URL
const SIGNUP_URL = `${API_URL}register`
const SIGNIN_URL = `${API_URL}login`
const SIGNOUT_URL = `${API_URL}logout`
const USER_INFO_URL = `${API_URL}user-info`
const USER_URL = `${API_URL}users`
const EMAIL_UPDATE_URL = `${API_URL}users/update-email`
const PASSWORD_UPDATE_URL = `${API_URL}users/update-password`

export default {
  state: {
    user: null
  },
  mutations: {
    setUser (state, payload) {
      if (payload) {
        localStorage.setItem('token', payload['api_token'])
        window.axios.defaults.headers.common['api_token'] = localStorage.getItem('token')
      }
      state.user = payload
    }
  },
  actions: {
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      window.axios.post(SIGNUP_URL, payload)
        .then(
          response => window.axios.post(SIGNIN_URL, payload)
            .then(
              response => {
                commit('setLoading', false)
                commit('setUser', response['data']['user'])
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
      window.axios.get(USER_INFO_URL)
        .then(
          response => {
            commit('setLoading', false)
            commit('setUser', response['data']['user'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    logout ({commit}) {
      window.axios.post(SIGNOUT_URL)
      commit('setUser', null)
      localStorage.removeItem('token')
    },
    updateUser ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.first_name) {
        updateObj.first_name = payload.first_name
      }
      if (payload.last_name) {
        updateObj.last_name = payload.last_name
      }
      window.axios.put(USER_URL + '/' + payload.id, updateObj)
        .then(() => {
          commit('setLoading', false)
          payload.api_token = localStorage.getItem('token')
          commit('setUser', payload)
          commit('clearError')
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
          commit('setError', error)
        })
    },
    updateEmail ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.email) {
        updateObj.email = payload.email
      }
      if (payload.password) {
        updateObj.password = payload.password
      }
      window.axios.put(EMAIL_UPDATE_URL, updateObj)
        .then(() => {
          commit('setLoading', false)
          payload.api_token = localStorage.getItem('token')
          commit('setUser', payload)
          commit('clearError')
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
          commit('setError', error)
        })
    },
    updatePassword ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.newPassword) {
        updateObj.newPassword = payload.newPassword
      }
      if (payload.password) {
        updateObj.password = payload.password
      }
      window.axios.put(PASSWORD_UPDATE_URL, updateObj)
        .then(() => {
          commit('setLoading', false)
          payload.api_token = localStorage.getItem('token')
          commit('setUser', payload)
          commit('clearError')
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
          commit('setError', error)
        })
    },
    destroyUser ({commit}, payload) {
      window.axios.delete(USER_URL + '/' + payload.id)
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
