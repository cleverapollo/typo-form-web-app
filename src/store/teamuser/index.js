const API_URL = process.env.API_URL
const APPLICATION_URL = `${API_URL}application/`
const TEAM_URL = `/team/`
const USER_URL = `/user/`

export default {
  state: {
    loadedTeamUsers: {},
    invitedTeamUsers: {}
  },
  mutations: {
    setLoadedTeamUsers (state, payload) {
      let users = Object.assign({}, state.loadedTeamUsers)
      users[payload.teamId] = payload.users
      state.loadedTeamUsers = users
    },
    setInvitedTeamUsers (state, payload) {
      let users = Object.assign({}, state.invitedTeamUsers)
      users[payload.teamId] = payload.users
      state.invitedTeamUsers = users
    },
    updateTeamUser (state, payload) {
      let users = Object.assign({}, state.loadedTeamUsers)
      const index = users[payload.teamId].findIndex(user => {
        return user.id === payload.user.user_id
      })
      users[payload.teamId].splice(index, 1, payload.user)
      state.loadedTeamUsers = users
    },
    deleteTeamUser (state, payload) {
      let users = Object.assign({}, state.loadedTeamUsers)
      users[payload.teamId] = users[payload.teamId].filter(e => {
        return e.id !== payload.id
      })
      state.loadedTeamUsers = users
    }
  },
  actions: {
    loadTeamUsers ({commit}, payload) {
      commit('setLoading', true)
      window.axios.get(APPLICATION_URL + payload.applicationName + TEAM_URL + payload.teamId + USER_URL)
        .then(
          response => {
            commit('setLoading', false)
            const updateLoadedObj = {
              teamId: payload.teamId,
              users: response['data']['users']['current']
            }
            commit('setLoadedTeamUsers', updateLoadedObj)

            const updateInvitedObj = {
              teamId: payload.teamId,
              users: response['data']['users']['unaccepted']
            }
            commit('setInvitedTeamUsers', updateInvitedObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    updateTeamUser ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.teamRoleId) {
        updateObj.team_role_id = payload.teamRoleId
      }
      window.axios.put(APPLICATION_URL + payload.applicationName + TEAM_URL + payload.teamId + USER_URL + payload.id, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              teamId: payload.teamId,
              user: response['data']['user']
            }
            commit('updateTeamUser', updateObj)
          }
        )
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteTeamUser ({commit}, payload) {
      commit('setLoading', true)
      window.axios.delete(APPLICATION_URL + payload.applicationName + TEAM_URL + payload.teamId + USER_URL + payload.id)
        .then(() => {
          commit('setLoading', false)
          commit('deleteTeamUser', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  },
  getters: {
    loadedTeamUsers (state) {
      return (teamId) => {
        if (!state.loadedTeamUsers[teamId]) {
          return []
        }
        return state.loadedTeamUsers[teamId].sort((userA, userB) => {
          return userA.id > userB.id
        })
      }
    },
    invitedTeamUsers (state) {
      return (teamId) => {
        if (!state.invitedTeamUsers[teamId]) {
          return []
        }
        return state.invitedTeamUsers[teamId].sort((userA, userB) => {
          return userA.id > userB.id
        })
      }
    },
    loadedTeamUser (state) {
      return (teamId, userId) => {
        if (!state.loadedTeamUsers[teamId]) {
          return null
        }
        return state.loadedTeamUsers[teamId].find((user) => {
          return user.id === userId
        })
      }
    }
  }
}
