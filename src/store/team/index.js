const API_URL = process.env.API_URL
const APPLICATION_URL = `${API_URL}application/`
const TEAM_URL = `team/`

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
        return team.applicationid === payload.applicationid && team.id === payload.id
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
        return e.id !== payload.id || e.applicationid !== payload.applicationid
      })
    }
  },
  actions: {
    loadTeams ({commit}, applicationid) {
      commit('setLoading', true)
      window.axios.get(APPLICATION_URL + applicationid + TEAM_URL)
        .then(
          response => {
            commit('setLoading', false)
            commit('setLoadedTeams', response['data']['result'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    createTeam ({commit, getters}, applicationid, payload) {
      const team = {
        name: payload.name,
        description: payload.description
      }
      window.axios.post(APPLICATION_URL + applicationid + TEAM_URL, team)
        .then(
          response => {
            commit('setLoading', false)
            commit('createTeam', response['data']['result'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    updateTeam ({commit}, applicationid, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.name) {
        updateObj.name = payload.name
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      window.axios.put(APPLICATION_URL + applicationid + TEAM_URL + payload.id, updateObj)
        .then(response => {
          commit('setLoading', false)
          commit('updateTeam', response['data']['result'])
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteTeam ({commit}, applicationid, payload) {
      commit('setLoading', true)
      window.axios.delete(APPLICATION_URL + applicationid + TEAM_URL + payload.id)
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
        return state.loadedTeams.find((team) => {
          return team.applicationid === applicationid
        })
        .sort((teamA, teamB) => {
          return teamA.id > teamB.id
        })
      }
    },
    loadedTeam (state) {
      return (applicationid, teamid) => {
        return state.loadedTeams.find((team) => {
          return team.id === teamid && team.applicationid === applicationid
        })
      }
    }
  }
}
