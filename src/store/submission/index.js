const API_URL = process.env.API_URL
const FORM_URL = `${API_URL}form/`
const APPLICATION_URL = `${API_URL}application/`
const SUBMISSION_URL = '/submission'

export default {
  state: {
    loadedSubmissions: {},
    loadedSubmissionFilters: {}
  },
  mutations: {
    clearLoadedSubmissions (state) {
      state.loadedSubmissions = {}
    },
    setLoadedSubmissions (state, payload) {
      let submissions = Object.assign({}, state.loadedSubmissions)
      submissions[payload.formId] = payload.submissions
      state.loadedSubmissions = submissions
    },
    submissionFilter (state, payload) {
      state.loadedSubmissionFilters = payload
    },
    setLoadedAllSubmissions (state, payload) {
      let submissions = Object.assign({}, state.loadedSubmissions)
      for (let i = 0; i < payload.submissions.length; i++) {
        const submission = payload.submissions[i]
        submissions[submission.form.id] = []
      }
      for (let i = 0; i < payload.submissions.length; i++) {
        const submission = payload.submissions[i]
        submissions[submission.form.id].push(submission)
      }
      state.loadedSubmissions = submissions
    },
    createSubmission (state, payload) {
      let submissions = Object.assign({}, state.loadedSubmissions)
      if (!submissions[payload.formId]) {
        submissions[payload.formId] = []
      }
      submissions[payload.formId].push(payload.submission)
      state.loadedSubmissions = submissions
    },
    updateSubmission (state, payload) {
      let submissions = Object.assign({}, state.loadedSubmissions)
      if (!submissions[payload.formId]) {
        submissions[payload.formId] = []
      }
      const index = submissions[payload.formId].findIndex(submission => {
        return submission.id === payload.submission.id
      })
      if (index) {
        submissions[payload.formId].splice(index, 1, payload.submission)
      } else {
        submissions[payload.formId].push(payload.submission)
      }
      state.loadedSubmissions = submissions
    },
    deleteSubmission (state, payload) {
      let submissions = Object.assign({}, state.loadedSubmissions)
      submissions[payload.formId] = submissions[payload.formId].filter(e => {
        return e.id !== payload.id
      })
      state.loadedSubmissions = submissions
    },
    setLoadedResponses (state, payload) {
      let submissions = Object.assign({}, state.loadedSubmissions)
      const submission = submissions[payload.formId].find((submission) => {
        return submission.id === payload.submissionId
      })
      submission.responses = payload.responses
      state.loadedSubmissions = submissions
    },
    createResponse (state, payload) {
      let submissions = Object.assign({}, state.loadedSubmissions)
      const submission = submissions[payload.formId].find((submission) => {
        return submission.id === payload.submissionId
      })
      submission.responses.push(payload.response)
      state.loadedSubmissions = submissions
    },
    updateResponse (state, payload) {
      let submissions = Object.assign({}, state.loadedSubmissions)
      const submission = submissions[payload.formId].find((submission) => {
        return submission.id === payload.submissionId
      })
      const index = submission.responses.findIndex(response => {
        return response.id === payload.oldId
      })
      submission.responses.splice(index, 1, payload.response)
      state.loadedSubmissions = submissions
    },
    deleteResponse (state, payload) {
      let submissions = Object.assign({}, state.loadedSubmissions)
      const submission = submissions[payload.formId].find((submission) => {
        return submission.id === payload.submissionId
      })
      submission.responses = submission.responses.filter(e => {
        return e.id !== payload.id
      })
      state.loadedSubmissions = submissions
    }
  },
  actions: {
    loadSubmissions ({commit}, formId) {
      commit('setLoading', true)
      window.axios.get(FORM_URL + formId + SUBMISSION_URL)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formId: formId,
              submissions: response['data']['submissions']
            }
            commit('setLoadedSubmissions', updateObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    loadAllSubmission ({commit}, payload) {
      commit('setLoading', true)
      return new Promise((resolve, reject) => {
        window.axios.get(APPLICATION_URL + payload.slug + SUBMISSION_URL + '/' + payload.id)
          .then(
            response => {
              commit('setLoading', false)
              const updateObj = {
                formId: response['data']['submission']['form']['id'],
                submission: response['data']['submission']
              }
              commit('updateSubmission', updateObj)
              resolve(response)
            }
          )
          .catch(
            error => {
              commit('setLoading', false)
              reject(error)
            }
          )
      })
    },
    loadAllSubmissions ({commit}, slug) {
      commit('setLoading', true)
      return new Promise((resolve, reject) => {
        window.axios.get(APPLICATION_URL + slug + SUBMISSION_URL)
          .then(
            response => {
              commit('setLoading', false)
              const updateObj = {
                submissions: response['data']['submissions']
              }
              commit('setLoadedAllSubmissions', updateObj)
              resolve(response)
            }
          )
          .catch(
            error => {
              commit('setLoading', false)
              reject(error)
            }
          )
      })
    },
    createSubmission ({commit, getters}, payload) {
      let submission = {
        period_start: payload.periodStart,
        period_end: payload.periodEnd
      }

      if (payload.userId) {
        submission.user_id = payload.userId
      }

      if (payload.organisationId) {
        submission.organisation_id = payload.organisationId
      }

      return new Promise((resolve, reject) => {
        window.axios.post(FORM_URL + payload.formId + SUBMISSION_URL, submission)
          .then(
            response => {
              commit('setLoading', false)
              const createObj = {
                formId: payload.formId,
                submission: response['data']['submission']
              }
              resolve(response)
              commit('createSubmission', createObj)
            }
          )
          .catch(
            error => {
              commit('setLoading', false)
              console.log(error)
            }
          )
      })
    },
    updateSubmission ({commit}, payload) {
      commit('setLoading', true)

      let submission = {
        organisation_id: payload.organisationId,
        user_id: payload.userId
      }

      if (payload.statusId) {
        submission.status_id = payload.statusId
      }

      if (payload.periodStart) {
        submission.period_start = payload.periodStart
      }

      if (payload.periodEnd) {
        submission.period_end = payload.periodEnd
      }

      if (payload.progress !== undefined) {
        submission.progress = parseInt(payload.progress)
      }

      return new Promise((resolve, reject) => {
        window.axios.put(FORM_URL + payload.formId + SUBMISSION_URL + '/' + payload.id, submission)
          .then(
            response => {
              commit('setLoading', false)
              const updateObj = {
                formId: payload.formId,
                submission: response['data']['submission']
              }
              commit('updateSubmission', updateObj)
              resolve(response)
            }
          )
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
            reject(error)
          })
      })
    },
    duplicateSubmission ({commit}, payload) {
      commit('setLoading', true)
      return new Promise((resolve, reject) => {
        window.axios.post(FORM_URL + payload.formId + SUBMISSION_URL + '/' + payload.id)
          .then(
            response => {
              commit('setLoading', false)
              const createdObj = {
                formId: payload.formId,
                submission: response['data']['submission']
              }
              commit('createSubmission', createdObj)
              resolve(response)
            }
          )
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
            reject(error)
          })
      })
    },
    deleteSubmission ({commit}, payload) {
      commit('setLoading', true)
      return new Promise((resolve, reject) => {
        window.axios.delete(FORM_URL + payload.formId + SUBMISSION_URL + '/' + payload.id)
          .then((response) => {
            commit('setLoading', false)
            commit('deleteSubmission', payload)
            resolve(response)
          })
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
            reject(error)
          })
      })
    },
    submissionFilter ({commit}, payload) {
      commit('setLoading', true)
      return new Promise((resolve, reject) => {
        window.axios.post(APPLICATION_URL + payload.slug + SUBMISSION_URL + '/filter', payload)
          .then((response) => {
            commit('setLoading', false)
            commit('submissionFilter', response['data']['submissions'])
            resolve(response.data.submissions)
          })
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
            reject(error)
          })
      })
    }
  },
  getters: {
    loadedSubmissions (state) {
      return (formId) => {
        if (!state.loadedSubmissions[formId]) {
          return []
        }

        return state.loadedSubmissions[formId]
      }
    },
    loadedAllSubmissions (state, getters, rootState) {
      return (slug) => {
        let submissions = []
        const forms = rootState.form.loadedForms[slug]
        if (!forms) {
          return []
        }
        for (var i = 0; i < forms.length; i++) {
          if (state.loadedSubmissions[forms[i].id]) {
            submissions = submissions.concat(state.loadedSubmissions[forms[i].id])
          }
        }
        return submissions
      }
    },
    loadedApplicationSubmission (state, getters, rootState) {
      return (slug, submissionId) => {
        const forms = rootState.form.loadedForms[slug]
        if (!forms) {
          return null
        }
        for (var i = 0; i < forms.length; i++) {
          if (state.loadedSubmissions[forms[i].id]) {
            const submission = state.loadedSubmissions[forms[i].id].find((submission) => {
              return submission.id === submissionId
            })
            if (submission) {
              return submission
            }
          }
        }
        return null
      }
    },
    loadedSubmissionFilters (state) {
      return () => {
        return state.loadedSubmissionFilters
      }
    },
    loadedSubmission (state) {
      return (formId, submissionId) => {
        if (!state.loadedSubmissions[formId]) {
          return null
        }

        return state.loadedSubmissions[formId].find((submission) => {
          return submission.id === submissionId
        })
      }
    },
    loadedSubmissionOrganisations (state, getters, rootState) {
      return (slug, formId) => {
        if (!rootState.organisation.loadedOrganisations[slug]) {
          return []
        }

        let organisations = rootState.organisation.loadedOrganisations[slug].slice(0)
        organisations.push({id: 0, name: 'No Organisation'})
        const submissions = state.loadedSubmissions[formId]
        if (submissions) {
          for (var i = 0; i < submissions.length; i++) {
            organisations = organisations.filter((organisation) => {
              if (!submissions[i].organisation) {
                return organisation.id !== 0
              } else {
                return submissions[i].organisation.name !== organisation.name
              }
            })
          }
        }
        return organisations
      }
    }
  }
}
