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
      teams[payload.applicationName] = payload.teams
      state.loadedTeams = teams
    },
    createTeam (state, payload) {
      state.loadedTeams[payload.applicationName].push(payload.team)
    },
    updateTeam (state, payload) {
      const team = state.loadedTeams[payload.applicationName].find(team => {
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
      state.loadedTeams[payload.applicationName] = state.loadedTeams[payload.applicationName].filter(e => {
        return e.id !== payload.id
      })
    }
  },
  actions: {
    loadTeams ({commit}, applicationName) {
      commit('setLoading', true)
      window.axios.get(APPLICATION_URL + applicationName + TEAM_URL)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              applicationName: applicationName,
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
    createTeam ({commit, getters}, payload) {
      const team = {
        name: payload.name,
        description: payload.description,
        invitations: payload.invitations
      }
      window.axios.post(APPLICATION_URL + payload.applicationName + TEAM_URL, team)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              applicationName: payload.applicationName,
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
      window.axios.post(APPLICATION_URL + payload.applicationName + TEAM_URL + payload.id + '/invite', team)
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
      window.axios.put(APPLICATION_URL + payload.applicationName + TEAM_URL + payload.id, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              applicationName: payload.applicationName,
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
      window.axios.delete(APPLICATION_URL + payload.applicationName + TEAM_URL + payload.id)
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
      return (applicationName) => {
        if (!state.loadedTeams[applicationName]) {
          return []
        }
        return state.loadedTeams[applicationName].sort((teamA, teamB) => {
          return teamA.id > teamB.id
        })
      }
    },
    loadedTeam (state) {
      return (applicationName, teamid) => {
        if (!state.loadedTeams[applicationName]) {
          return null
        }
        return state.loadedTeams[applicationName].find((team) => {
          return team.id === teamid
        })
      }
    }
  }
}
