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
      users[payload.teamid] = payload.users
      state.loadedTeamUsers = users
    },
    setInvitedTeamUsers (state, payload) {
      let users = Object.assign({}, state.invitedTeamUsers)
      users[payload.teamid] = payload.users
      state.invitedTeamUsers = users
    },
    updateTeamUser (state, payload) {
      const user = state.loadedTeamUsers[payload.teamid].find(user => {
        return user.id === payload.user.user_id
      })
      if (payload.user.role) {
        user.team_role = payload.user.role
      }
    },
    deleteTeamUser (state, payload) {
      state.loadedTeamUsers[payload.teamid] = state.loadedTeamUsers[payload.teamid].filter(e => {
        return e.id !== payload.id
      })
    }
  },
  actions: {
    loadTeamUsers ({commit}, payload) {
      commit('setLoading', true)
      window.axios.get(APPLICATION_URL + payload.applicationid + TEAM_URL + payload.teamid + USER_URL)
        .then(
          response => {
            commit('setLoading', false)
            const updateLoadedObj = {
              teamid: payload.teamid,
              users: response['data']['users']['current']
            }
            commit('setLoadedTeamUsers', updateLoadedObj)

            const updateInvitedObj = {
              teamid: payload.teamid,
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
      if (payload.role) {
        updateObj.role = payload.role
      }
      window.axios.put(APPLICATION_URL + payload.applicationid + TEAM_URL + payload.teamid + USER_URL + payload.id, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              teamid: payload.teamid,
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
      window.axios.delete(APPLICATION_URL + payload.applicationid + TEAM_URL + payload.teamid + USER_URL + payload.id)
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
      return (teamid) => {
        if (!state.loadedTeamUsers[teamid]) {
          return []
        }
        return state.loadedTeamUsers[teamid].sort((userA, userB) => {
          return userA.id > userB.id
        })
      }
    },
    invitedTeamUsers (state) {
      return (teamid) => {
        if (!state.invitedTeamUsers[teamid]) {
          return []
        }
        return state.invitedTeamUsers[teamid].sort((userA, userB) => {
          return userA.id > userB.id
        })
      }
    },
    loadedTeamUser (state) {
      return (teamid, userid) => {
        if (!state.loadedTeamUsers[teamid]) {
          return null
        }
        return state.loadedTeamUsers[teamid].find((user) => {
          return user.id === userid
        })
      }
    }
  }
}
