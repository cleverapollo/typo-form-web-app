const API_URL = process.env.API_URL
const APPLICATION_URL = `${API_URL}application/`

export default {
  state: {
    loadedApplications: []
  },
  mutations: {
    setLoadedApplication (state, payload) {
      const index = state.loadedApplications.findIndex(application => {
        return application.id === payload.id
      })
      if (index !== -1) {
        state.loadedApplications.splice(index, 1, payload)
      } else {
        state.loadedApplications.push(payload)
      }
    },
    setLoadedApplications (state, payload) {
      state.loadedApplications = payload
    },
    createApplication (state, payload) {
      state.loadedApplications.push(payload)
    },
    updateApplication (state, payload) {
      const index = state.loadedApplications.findIndex(application => {
        return application.slug === payload.slug
      })
      state.loadedApplications.splice(index, 1, payload.application)
    },
    deleteApplication (state, payload) {
      state.loadedApplications = state.loadedApplications.filter(e => {
        return e.slug !== payload.slug
      })
    }
  },
  actions: {
    loadApplication ({commit}, slug) {
      commit('setLoading', true)
      return new Promise((resolve, reject) => {
        window.axios.get(APPLICATION_URL + slug)
          .then(
            response => {
              commit('setLoading', false)
              commit('setLoadedApplication', response['data']['application'])
              resolve(response)
            }
          )
          .catch(
            error => {
              commit('setLoading', false)
              reject(error)
              console.log(error)
            }
          )
      })
    },
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
        css: payload.css,
        icon: payload.icon,
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
      const application = {
        invitations: payload.invitations
      }
      window.axios.post(APPLICATION_URL + payload.slug + '/invite', application)
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
        updateObj.css = payload.css
        updateObj.icon = payload.icon
      }
      window.axios.put(APPLICATION_URL + payload.slug, updateObj)
        .then(response => {
          commit('setLoading', false)
          const updateObject = {
            slug: payload.slug,
            application: response['data']['application']
          }
          commit('updateApplication', updateObject)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteApplication ({commit}, payload) {
      commit('setLoading', true)
      window.axios.delete(APPLICATION_URL + payload.slug)
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
      return (slug) => {
        return state.loadedApplications.find((application) => {
          return application.slug === slug
        })
      }
    }
  }
}
