const API_URL = process.env.API_URL
const FORM_URL = `${API_URL}form/`
const APPLICATION_URL = `${API_URL}application/`
const SUBMISSION_URL = '/submission/'

export default {
  state: {
    loadedSubmissions: {}
  },
  mutations: {
    setLoadedSubmissions (state, payload) {
      let submissions = Object.assign({}, state.loadedSubmissions)
      submissions[payload.formId] = payload.submissions
      state.loadedSubmissions = submissions
    },
    setLoadedAllSubmissions (state, payload) {
      let submissions = Object.assign({}, state.loadedSubmissions)
      for (let i = 0; i < payload.submissions.length; i++) {
        const submission = payload.submissions[i]
        if (!submissions[submission.form.id]) {
          submissions[submission.form.id] = []
        }
        const index = submissions[submission.form.id].findIndex(e => {
          return e.id === submission.id
        })
        if (index === -1) {
          submissions[submission.form.id].push(submission)
        } else {
          submissions[submission.form.id].splice(index, 1, submission)
        }
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
      const index = submissions[payload.formId].findIndex(submission => {
        return submission.id === payload.submission.id
      })
      submissions[payload.formId].splice(index, 1, payload.submission)
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
              console.log(error)
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

      if (payload.teamId) {
        submission.team_id = payload.teamId
      }

      window.axios.post(FORM_URL + payload.formId + SUBMISSION_URL, submission)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              formId: payload.formId,
              submission: response['data']['submission']
            }
            commit('createSubmission', createObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    updateSubmission ({commit}, payload) {
      commit('setLoading', true)

      let submission = {}

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
        submission.progress = payload.progress
      }

      window.axios.put(FORM_URL + payload.formId + SUBMISSION_URL + payload.id, submission)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formId: payload.formId,
              submission: response['data']['submission']
            }
            commit('updateSubmission', updateObj)
          }
        )
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteSubmission ({commit}, payload) {
      commit('setLoading', true)
      window.axios.delete(FORM_URL + payload.formId + SUBMISSION_URL + payload.id)
        .then(() => {
          commit('setLoading', false)
          commit('deleteSubmission', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
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
    loadedSubmissionTeams (state, getters, rootState) {
      return (slug, formId) => {
        if (!rootState.team.loadedTeams[slug]) {
          return []
        }

        let teams = rootState.team.loadedTeams[slug].slice(0)
        teams.push({id: 0, name: 'No Team'})
        const submissions = state.loadedSubmissions[formId]
        if (submissions) {
          for (var i = 0; i < submissions.length; i++) {
            teams = teams.filter((team) => {
              if (!submissions[i].team) {
                return team.id !== 0
              } else {
                return submissions[i].team.name !== team.name
              }
            })
          }
        }
        return teams
      }
    }
  }
}
