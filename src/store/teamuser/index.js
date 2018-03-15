const API_URL = process.env.API_URL
const APPLICATION_URL = `${API_URL}application/`
const TEAM_URL = `/team/`
const USER_URL = `/user/`

export default {
  state: {
    loadedTeamUsers: [],
    invitedTeamUsers: []
  },
  mutations: {
    setLoadedTeamUsers (state, payload) {
      state.loadedTeamUsers = payload
    },
    setInvitedTeamUsers (state, payload) {
      state.invitedTeamUsers = payload
    },
    updateTeamUser (state, payload) {
      const teamuser = state.loadedTeamUsers.find(teamuser => {
        return teamuser.id === payload.user_id
      })
      console.log(payload)
      if (payload.role) {
        teamuser.team_pivot.role = payload.role
      }
    },
    deleteTeamUser (state, payload) {
      state.loadedTeamUsers = state.loadedTeamUsers.filter(e => {
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
            commit('setLoadedTeamUsers', response['data']['users']['current'])
            commit('setInvitedTeamUsers', response['data']['users']['unaccepted'])
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
        .then(response => {
          commit('setLoading', false)
          commit('updateTeamUser', response['data']['user'])
        })
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
      return state.loadedTeamUsers.sort((teamuserA, teamuserB) => {
        return teamuserA.id > teamuserB.id
      })
    },
    invitedTeamUsers (state) {
      return state.invitedTeamUsers.sort((teamuserA, teamuserB) => {
        return teamuserA.id > teamuserB.id
      })
    },
    loadedTeamUser (state) {
      return (teamuserid) => {
        return state.loadedTeamUsers.find((teamuser) => {
          return teamuser.id === teamuserid
        })
      }
    }
  }
}
