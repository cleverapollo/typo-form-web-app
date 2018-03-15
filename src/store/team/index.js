const API_URL = process.env.API_URL
const APPLICATION_URL = `${API_URL}application/`
const TEAM_URL = `/team/`

export default {
  state: {
    loadedTeams: []
  },
  mutations: {
    setLoadedTeams (state, payload) {
      state.loadedTeams = payload
    },
    createTeam (state, payload) {
      state.loadedTeams.push(payload)
    },
    updateTeam (state, payload) {
      const team = state.loadedTeams.find(team => {
        return team.id === payload.id
      })
      if (payload.name) {
        team.name = payload.name
      }
      if (payload.description) {
        team.description = payload.description
      }
    },
    deleteTeam (state, payload) {
      state.loadedTeams = state.loadedTeams.filter(e => {
        return e.id !== payload.id
      })
    },
    setLoadedTeamToken (state, payload) {
      if (payload.shareToken) {
        const index = state.loadedTeams.findIndex(team => {
          return team.id === parseInt(payload.id)
        })
        let team = state.loadedTeams[index]
        team.shareToken = payload.shareToken
        state.loadedTeams.splice(index, 1, team)
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
            commit('setLoadedTeams', response['data']['teams'])
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
      window.axios.get(APPLICATION_URL + payload.applicationid + TEAM_URL + payload.id + '/invite')
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              id: payload.id,
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
            commit('createTeam', response['data']['team'])
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
        .then(response => {
          commit('setLoading', false)
          commit('updateTeam', response['data']['team'])
        })
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
      return state.loadedTeams.sort((teamA, teamB) => {
        return teamA.id > teamB.id
      })
    },
    loadedTeam (state) {
      return (teamid) => {
        return state.loadedTeams.find((team) => {
          return team.id === teamid
        })
      }
    }
  }
}
