const API_URL = process.env.API_URL
const APPLICATION_URL = `${API_URL}application/`
const USER_URL = `/user/`

export default {
  state: {
    loadedUsers: [],
    invitedUsers: []
  },
  mutations: {
    setLoadedUsers (state, payload) {
      state.loadedUsers = payload
    },
    setInvitedUsers (state, payload) {
      state.invitedUsers = payload
    },
    updateUser (state, payload) {
      const user = state.loadedUsers.find(user => {
        return user.id === payload.user_id
      })
      if (payload.role) {
        user.application_pivot.role = payload.role
      }
    },
    deleteUser (state, payload) {
      state.loadedUsers = state.loadedUsers.filter(e => {
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
            commit('setLoadedUsers', response['data']['users']['current'])
            commit('setInvitedUsers', response['data']['users']['unaccepted'])
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
        .then(response => {
          commit('setLoading', false)
          commit('updateUser', response['data']['user'])
        })
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
      return state.loadedUsers.sort((userA, userB) => {
        return userA.id > userB.id
      })
    },
    invitedUsers (state) {
      return state.invitedUsers.sort((userA, userB) => {
        return userA.id > userB.id
      })
    },
    loadedUser (state) {
      return (userid) => {
        return state.loadedUsers.find((user) => {
          return user.id === userid
        })
      }
    }
  }
}
