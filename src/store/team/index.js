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
      let teams = Object.assign({}, state.loadedTeams)
      teams[payload.applicationName].push(payload.team)
      state.loadedTeams = teams
    },
    updateTeam (state, payload) {
      let teams = Object.assign({}, state.loadedTeams)
      const index = teams[payload.applicationName].findIndex(team => {
        return team.id === payload.team.id
      })
      teams[payload.applicationName].splice(index, 1, payload.team)
      state.loadedTeams = teams
    },
    deleteTeam (state, payload) {
      let teams = Object.assign({}, state.loadedTeams)
      teams[payload.applicationName] = teams[payload.applicationName].filter(e => {
        return e.id !== payload.id
      })
      state.loadedTeams = teams
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
      return (applicationName, teamId) => {
        if (!state.loadedTeams[applicationName]) {
          return null
        }
        return state.loadedTeams[applicationName].find((team) => {
          return team.id === teamId
        })
      }
    }
  }
}
