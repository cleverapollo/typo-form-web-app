const API_URL = process.env.API_URL
const FORM_URL = `${API_URL}form/`
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
    createSubmission (state, payload) {
      state.loadedSubmissions[payload.formId].push(payload.submission)
    },
    updateSubmission (state, payload) {
      const index = state.loadedSubmissions[payload.formId].findIndex(submission => {
        return submission.id === payload.submission.id
      })
      state.loadedSubmissions[payload.formId].splice(index, 1, payload.submission)
    },
    deleteSubmission (state, payload) {
      state.loadedSubmissions[payload.formId] = state.loadedSubmissions[payload.formId].filter(e => {
        return e.id !== payload.id
      })
    },
    setLoadedResponses (state, payload) {
      const submission = state.loadedSubmissions[payload.formId].find((submission) => {
        return submission.id === payload.submissionId
      })
      submission.responses = payload.responses
    },
    createResponse (state, payload) {
      const submission = state.loadedSubmissions[payload.formId].find((submission) => {
        return submission.id === payload.submissionId
      })
      submission.responses = submission.responses.slice(0)
      submission.responses.push(payload.response)
    },
    updateResponse (state, payload) {
      const submission = state.loadedSubmissions[payload.formId].find((submission) => {
        return submission.id === payload.submissionId
      })
      const index = submission.responses.findIndex(response => {
        return response.id === payload.oldId
      })
      submission.responses.splice(index, 1, payload.response)
    },
    deleteResponse (state, payload) {
      const submission = state.loadedSubmissions[payload.formId].find((submission) => {
        return submission.id === payload.submissionId
      })
      submission.responses = submission.responses.filter(e => {
        return e.id !== payload.id
      })
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
    createSubmission ({commit, getters}, payload) {
      let submission = {
        period_start: payload.periodStart,
        period_end: payload.periodEnd
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
      return (applicationId, formId) => {
        console.log(state.loadedSubmissions)
        if (!rootState.team.loadedTeams[applicationId]) {
          return []
        }

        const teams = rootState.team.loadedTeams[applicationId]
        if (!state.loadedSubmissions[formId]) {
          return teams
        }

        return teams.filter((team) => {
          const index = state.loadedSubmissions[formId].find((submission) => {
            return submission.team && submission.team.id === team.id
          })
          return index === -1
        })
      }
    }
  }
}
