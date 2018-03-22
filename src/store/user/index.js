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
      users[payload.applicationid] = payload.users
      state.loadedUsers = users
    },
    setInvitedUsers (state, payload) {
      let users = Object.assign({}, state.invitedUsers)
      users[payload.applicationid] = payload.users
      state.invitedUsers = users
    },
    updateUser (state, payload) {
      const user = state.loadedUsers[payload.applicationid].find(user => {
        return user.id === payload.user.user_id
      })
      if (payload.user.role) {
        user.application_pivot.role = payload.user.role
      }
    },
    deleteUser (state, payload) {
      state.loadedUsers[payload.applicationid] = state.loadedUsers[payload.applicationid].filter(e => {
        return e.id !== payload.id
      })
    }
  },
  actions: {
    loadUsers ({commit}, applicationid) {
      commit('setLoading', true)
      window.axios.get(APPLICATION_URL + applicationid + USER_URL)
        .then(
          response => {
            commit('setLoading', false)
            const updateLoadedObj = {
              applicationid: applicationid,
              users: response['data']['users']['current']
            }
            commit('setLoadedUsers', updateLoadedObj)

            const updateInvitedObj = {
              applicationid: applicationid,
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
      if (payload.role) {
        updateObj.role = payload.role
      }
      window.axios.put(APPLICATION_URL + payload.applicationid + USER_URL + payload.id, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              applicationid: payload.applicationid,
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
      window.axios.delete(APPLICATION_URL + payload.applicationid + USER_URL + payload.id)
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
      return (applicationid) => {
        if (!state.loadedUsers[applicationid]) {
          return []
        }
        return state.loadedUsers[applicationid].sort((userA, userB) => {
          return userA.id > userB.id
        })
      }
    },
    invitedUsers (state) {
      return (applicationid) => {
        if (!state.invitedUsers[applicationid]) {
          return []
        }
        return state.invitedUsers[applicationid].sort((userA, userB) => {
          return userA.id > userB.id
        })
      }
    },
    loadedUser (state) {
      return (applicationid, userid) => {
        if (!state.loadedUsers[applicationid]) {
          return null
        }
        return state.loadedUsers[applicationid].find((user) => {
          return user.id === userid
        })
      }
    }
  }
}
