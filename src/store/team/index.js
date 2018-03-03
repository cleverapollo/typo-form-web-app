const API_URL = process.env.API_URL
const TEAM_URL = `${API_URL}teams`

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
    }
  },
  actions: {
    loadTeams ({commit}) {
      commit('setLoading', true)
      window.axios.get(TEAM_URL)
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
    createTeam ({commit, getters}, payload) {
      const team = {
        name: payload.name,
        description: payload.description
      }
      window.axios.post(TEAM_URL, team)
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
    updateTeam ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.name) {
        updateObj.name = payload.name
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      window.axios.put(TEAM_URL + '/' + payload.id, updateObj)
        .then(response => {
          commit('setLoading', false)
          commit('updateTeam', response['data']['result'])
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteTeam ({commit}, payload) {
      commit('setLoading', true)
      window.axios.delete(TEAM_URL + '/' + payload.id)
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
