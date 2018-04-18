const API_URL = process.env.API_URL
const APPLICATION_URL = `${API_URL}application/`
const USER_URL = `/user/`

export default {
  state: {
    loadedUsers: {},
    invitedUsers: {}
  },
  mutations: {
    setLoadedUsers (state, payload) {
      let users = Object.assign({}, state.loadedUsers)
      users[payload.applicationName] = payload.users
      state.loadedUsers = users
    },
    setInvitedUsers (state, payload) {
      let users = Object.assign({}, state.invitedUsers)
      users[payload.applicationName] = payload.users
      state.invitedUsers = users
    },
    updateUser (state, payload) {
      const user = state.loadedUsers[payload.applicationName].find(user => {
        return user.id === payload.user.user_id
      })
      if (payload.user.application_role_id) {
        user.application_role_id = payload.user.application_role_id
      }
    },
    deleteUser (state, payload) {
      state.loadedUsers[payload.applicationName] = state.loadedUsers[payload.applicationName].filter(e => {
        return e.id !== payload.id
      })
    }
  },
  actions: {
    loadUsers ({commit}, applicationName) {
      commit('setLoading', true)
      window.axios.get(APPLICATION_URL + applicationName + USER_URL)
        .then(
          response => {
            commit('setLoading', false)
            const updateLoadedObj = {
              applicationName: applicationName,
              users: response['data']['users']['current']
            }
            commit('setLoadedUsers', updateLoadedObj)

            const updateInvitedObj = {
              applicationName: applicationName,
              users: response['data']['users']['unaccepted']
            }
            commit('setInvitedUsers', updateInvitedObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    updateUser ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.application_role_id) {
        updateObj.application_role_id = payload.application_role_id
      }
      window.axios.put(APPLICATION_URL + payload.applicationName + USER_URL + payload.id, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              applicationName: payload.applicationName,
              user: response['data']['user']
            }
            commit('updateUser', updateObj)
          }
        )
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteUser ({commit}, payload) {
      commit('setLoading', true)
      window.axios.delete(APPLICATION_URL + payload.applicationName + USER_URL + payload.id)
        .then(() => {
          commit('setLoading', false)
          commit('deleteUser', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  },
  getters: {
    loadedUsers (state) {
      return (applicationName) => {
        if (!state.loadedUsers[applicationName]) {
          return []
        }
        return state.loadedUsers[applicationName].sort((userA, userB) => {
          return userA.id > userB.id
        })
      }
    },
    invitedUsers (state) {
      return (applicationName) => {
        if (!state.invitedUsers[applicationName]) {
          return []
        }
        return state.invitedUsers[applicationName].sort((userA, userB) => {
          return userA.id > userB.id
        })
      }
    },
    loadedUser (state) {
      return (applicationName, userid) => {
        if (!state.loadedUsers[applicationName]) {
          return null
        }
        return state.loadedUsers[applicationName].find((user) => {
          return user.id === userid
        })
      }
    }
  }
}
