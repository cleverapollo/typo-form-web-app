const API_URL = process.env.API_URL
const APPLICATION_URL = `${API_URL}application/`
const TEAM_URL = `/team/`

export default {
  state: {
    loadedTeams: {}
  },
  mutations: {
    setLoadedTeams (state, payload) {
      let teams = Object.assign({}, state.loadedTeams)
      teams[payload.applicationid] = payload.teams
      state.loadedTeams = teams
    },
    createTeam (state, payload) {
      state.loadedTeams[payload.applicationid].push(payload.team)
    },
    updateTeam (state, payload) {
      const team = state.loadedTeams[payload.applicationid].find(team => {
        return team.id === payload.team.id
      })
      if (payload.team.name) {
        team.name = payload.team.name
      }
      if (payload.team.description) {
        team.description = payload.team.description
      }
    },
    deleteTeam (state, payload) {
      state.loadedTeams = state.loadedTeams[payload.applicationid].filter(e => {
        return e.id !== payload.id
      })
    },
    setLoadedTeamToken (state, payload) {
      if (payload.shareToken) {
        const index = state.loadedTeams[payload.applicationid].findIndex(team => {
          return team.id === parseInt(payload.id)
        })
        let team = state.loadedTeams[payload.applicationid][index]
        team.shareToken = payload.shareToken
        state.loadedTeams[payload.applicationid].splice(index, 1, team)
      }
    }
  },
  actions: {
    loadTeams ({commit}, applicationid) {
      commit('setLoading', true)
      window.axios.get(APPLICATION_URL + applicationid + TEAM_URL)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              applicationid: applicationid,
              teams: response['data']['teams']
            }
            commit('setLoadedTeams', updateObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    loadTeamToken ({commit}, payload) {
      commit('setLoading', true)
      window.axios.get(APPLICATION_URL + payload.applicationid + TEAM_URL + payload.id + '/get-token')
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              id: payload.id,
              applicationid: payload.applicationid,
              shareToken: response['data']['shareToken']
            }
            commit('setLoadedTeamToken', updateObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    createTeam ({commit, getters}, payload) {
      const team = {
        name: payload.name,
        description: payload.description,
        invitations: payload.invitations
      }
      window.axios.post(APPLICATION_URL + payload.applicationid + TEAM_URL, team)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              applicationid: payload.applicationid,
              team: response['data']['team']
            }
            commit('createTeam', createObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    inviteTeam ({commit, getters}, payload) {
      const team = {
        invitations: payload.invitations
      }
      window.axios.post(APPLICATION_URL + payload.applicationid + TEAM_URL + payload.id + '/invite', team)
        .then(
          response => {
            commit('setLoading', false)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    updateTeam ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.name) {
        updateObj.name = payload.name
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      window.axios.put(APPLICATION_URL + payload.applicationid + TEAM_URL + payload.id, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              applicationid: payload.applicationid,
              team: response['data']['team']
            }
            commit('updateTeam', updateObj)
          }
        )
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteTeam ({commit}, payload) {
      commit('setLoading', true)
      window.axios.delete(APPLICATION_URL + payload.applicationid + TEAM_URL + payload.id)
        .then(() => {
          commit('setLoading', false)
          commit('deleteTeam', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  },
  getters: {
    loadedTeams (state) {
      return (applicationid) => {
        if (!state.loadedTeams[applicationid]) {
          return []
        }
        return state.loadedTeams[applicationid].sort((teamA, teamB) => {
          return teamA.id > teamB.id
        })
      }
    },
    loadedTeam (state) {
      return (applicationid, teamid) => {
        if (!state.loadedTeams[applicationid]) {
          return []
        }
        return state.loadedTeams[applicationid].find((team) => {
          return team.id === teamid
        })
      }
    }
  }
}
