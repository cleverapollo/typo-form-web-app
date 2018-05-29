const API_URL = process.env.API_URL
const APPLICATION_URL = `${API_URL}application/`
const USER_URL = `/user/`
const EMAIL_URL = `/application-email/`

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
    setLoadedApplicationEmail (state, payload) {
      const index = state.loadedApplications.findIndex(application => {
        return application.slug === payload.slug
      })
      const application = Object.assign({}, state.loadedApplications[index])
      application.application_emails = payload.application_emails
      state.loadedApplications.splice(index, 1, application)
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
    },
    updateApplicationEmail (state, payload) {
      const index = state.loadedApplications.findIndex(application => {
        return application.slug === payload.slug
      })
      const application = Object.assign({}, state.loadedApplications[index])
      const applicationEmailIndex = application.application_emails.findIndex(applicationEmail => {
        return applicationEmail.id === payload.application_email.id
      })
      application.application_emails.splice(applicationEmailIndex, 1, payload.application_email)
      state.loadedApplications.splice(index, 1, application)
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
        name: payload.name
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
            window.axios.get(APPLICATION_URL + payload.slug + USER_URL)
              .then(
                response => {
                  commit('setLoading', false)
                  const updateLoadedObj = {
                    slug: payload.slug,
                    users: response['data']['users']['current']
                  }
                  commit('setLoadedUsers', updateLoadedObj)

                  const updateInvitedObj = {
                    slug: payload.slug,
                    users: response['data']['users']['unaccepted']
                  }
                  commit('setInvitedUsers', updateInvitedObj)
                }
              )
              .catch(
                error => {
                  commit('setLoading', false)
                  console.log(error)
                }
              )
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
      if (payload.css) {
        updateObj.css = payload.css
      }
      if (payload.icon) {
        updateObj.icon = payload.icon
      }
      return new Promise((resolve, reject) => {
        window.axios.put(APPLICATION_URL + payload.slug, updateObj)
          .then(response => {
            commit('setLoading', false)
            const updateObject = {
              slug: payload.slug,
              application: response['data']['application']
            }
            commit('updateApplication', updateObject)
            resolve(response)
          })
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
            reject(error)
          })
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
    },
    loadApplicationEmail ({commit}, slug) {
      commit('setLoading', true)
      window.axios.get(APPLICATION_URL + slug + EMAIL_URL)
        .then(
          response => {
            commit('setLoading', false)
            const emailObj = {
              application_emails: response['data']['application_emails'],
              slug: slug
            }
            commit('setLoadedApplicationEmail', emailObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    updateApplicationEmail ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.recipients) {
        updateObj.recipients = payload.recipients
      }
      if (payload.subject) {
        updateObj.subject = payload.subject
      }
      if (payload.body) {
        updateObj.body = payload.body
      }
      window.axios.put(APPLICATION_URL + payload.slug + EMAIL_URL + payload.id, updateObj)
        .then(response => {
          commit('setLoading', false)
          const updateObject = {
            slug: payload.slug,
            application_email: response['data']['application_email']
          }
          commit('updateApplicationEmail', updateObject)
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
        return applicationA.name > applicationB.name
      })
    },
    loadedApplication (state) {
      return (slug) => {
        return state.loadedApplications.find((application) => {
          return application.slug === slug
        })
      }
    },
    loadedApplicationById (state) {
      return (applicationId) => {
        return state.loadedApplications.find((application) => {
          return application.id === applicationId
        })
      }
    },
    loadedApplicationEmail (state) {
      return (slug) => {
        const application = state.loadedApplications.find((application) => {
          return application.slug === slug
        })
        if (application.application_emails && application.application_emails.length) {
          return application.application_emails[0]
        }
        return null
      }
    }
  }
}
