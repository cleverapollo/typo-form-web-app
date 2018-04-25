const API_URL = process.env.API_URL
const SIGNUP_URL = `${API_URL}register`
const SIGNIN_URL = `${API_URL}login`
const SIGNOUT_URL = `${API_URL}logout`
const USER_URL = `${API_URL}user/`
const PASSWORD_RESET_URL = `${API_URL}password/reset/`
const EMAIL_UPDATE_URL = `${API_URL}user/update-email`
const PASSWORD_UPDATE_URL = `${API_URL}user/update-password`

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
          response => window.axios.post(SIGNIN_URL, payload)
            .then(
              response => {
                commit('setLoading', false)
                const user = response['data']['user']
                localStorage.setItem('token', user['api_token'])
                localStorage.setItem('expire_date', Date.now())
                window.axios.defaults.headers.common['api_token'] = user['api_token']
                commit('setUser', user)
              }
            )
            .catch(
              error => {
                commit('setLoading', false)
                commit('setUser', null)
                commit('setError', error.response.data)
                console.log(error.response.data)
              }
            )
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error.response.data)
            console.log(error.response.data)
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
            const user = response['data']['user']
            localStorage.setItem('token', user['api_token'])
            localStorage.setItem('expire_date', Date.now())
            window.axios.defaults.headers.common['api_token'] = user['api_token']
            commit('setUser', user)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setUser', null)
            commit('setError', error.response.data)
            console.log(error.response.data)
          }
        )
    },
    autoSignIn ({commit}) {
      commit('setLoading', true)
      commit('clearError')
      return new Promise((resolve, reject) => {
        window.axios.get(USER_URL)
          .then(
            response => {
              commit('setLoading', false)
              commit('setUser', response['data']['user'])
              resolve(response)
            }
          )
          .catch(
            error => {
              commit('setLoading', false)
              commit('setUser', null)
              reject(error)
              console.log(error.response.data)
            }
          )
      })
    },
    logout ({commit}) {
      commit('clearError')
      window.axios.post(SIGNOUT_URL)
      commit('setUser', null)
      localStorage.removeItem('token')
      localStorage.removeItem('expire_date')
    },
    updateAuth ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      const updateObj = {}
      if (payload.first_name) {
        updateObj.first_name = payload.first_name
      }
      if (payload.last_name) {
        updateObj.last_name = payload.last_name
      }
      window.axios.put(USER_URL, updateObj)
        .then(response => {
          commit('setLoading', false)
          commit('setUser', response['data']['user'])
          commit('clearError')
        })
        .catch(error => {
          console.log(error.response.data)
          commit('setLoading', false)
          commit('setError', error.response.data)
        })
    },
    updateEmail ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      const updateObj = {}
      if (payload.email) {
        updateObj.email = payload.email
      }
      if (payload.password) {
        updateObj.password = payload.password
      }
      window.axios.put(EMAIL_UPDATE_URL, updateObj)
        .then(response => {
          commit('setLoading', false)
          commit('setUser', response['data']['user'])
          commit('clearError')
        })
        .catch(error => {
          console.log(error.response.data)
          commit('setLoading', false)
          commit('setError', error.response.data)
        })
    },
    updatePassword ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      const updateObj = {}
      if (payload.newPassword) {
        updateObj.newPassword = payload.newPassword
      }
      if (payload.password) {
        updateObj.password = payload.password
      }
      window.axios.put(PASSWORD_UPDATE_URL, updateObj)
        .then(response => {
          commit('setLoading', false)
          commit('clearError')
        })
        .catch(error => {
          console.log(error.response.data)
          commit('setLoading', false)
          commit('setError', error.response.data)
        })
    },
    resetPassword ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      let obj = {}
      if (payload.password) {
        obj.password = payload.password
      }
      if (payload.email) {
        obj.email = payload.email
      }
      let token = ''
      if (payload.token) {
        token = payload.token
      }
      return new Promise((resolve, reject) => {
        window.axios.post(PASSWORD_RESET_URL + token, obj)
          .then(response => {
            commit('setLoading', false)
            commit('clearError')
            resolve(response)
          })
          .catch(error => {
            console.log(error.response.data)
            commit('setLoading', false)
            commit('setError', error.response.data)
            reject(error)
          })
      })
    },
    destroyUser ({commit}) {
      commit('clearError')
      window.axios.delete(USER_URL)
      commit('setUser', null)
      localStorage.removeItem('token')
      localStorage.removeItem('expire_date')
    }
  },
  getters: {
    user (state) {
      return state.user
    }
  }
}
