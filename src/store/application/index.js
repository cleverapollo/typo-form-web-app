const API_URL = process.env.API_URL
const APPLICATION_URL = `${API_URL}application/`

export default {
  state: {
    loadedApplications: []
  },
  mutations: {
    setLoadedApplications (state, payload) {
      state.loadedApplications = payload
    },
    createApplication (state, payload) {
      state.loadedApplications.push(payload)
    },
    updateApplication (state, payload) {
      const application = state.loadedApplications.find(application => {
        return application.id === payload.id
      })
      if (payload.name) {
        application.name = payload.name
      }
    },
    deleteApplication (state, payload) {
      state.loadedApplications = state.loadedApplications.filter(e => {
        return e.id !== payload.id
      })
    }
  },
  actions: {
    loadApplications ({commit}) {
      commit('setLoading', true)
      window.axios.get(APPLICATION_URL)
        .then(
          response => {
            commit('setLoading', false)
            commit('setLoadedApplications', response['data']['applications'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    createApplication ({commit, getters}, payload) {
      const application = {
        name: payload.name,
        invitations: payload.invitations
      }
      window.axios.post(APPLICATION_URL, application)
        .then(
          response => {
            commit('setLoading', false)
            commit('createApplication', response['data']['application'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    inviteApplication ({commit, getters}, payload) {
      window.axios.post(APPLICATION_URL + 'invite', payload)
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
    updateApplication ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.name) {
        updateObj.name = payload.name
      }
      window.axios.put(APPLICATION_URL + '/' + payload.id, updateObj)
        .then(response => {
          commit('setLoading', false)
          commit('updateApplication', response['data']['application'])
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteApplication ({commit}, payload) {
      commit('setLoading', true)
      window.axios.delete(APPLICATION_URL + '/' + payload.id)
        .then(() => {
          commit('setLoading', false)
          commit('deleteApplication', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  },
  getters: {
    loadedApplications (state) {
      return state.loadedApplications.sort((applicationA, applicationB) => {
        return applicationA.id > applicationB.id
      })
    },
    loadedApplication (state) {
      return (applicationid) => {
        return state.loadedApplications.find((application) => {
          return application.id === applicationid
        })
      }
    }
  }
}
