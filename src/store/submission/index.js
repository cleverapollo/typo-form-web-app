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
      submissions[payload.formid] = payload.submissions
      state.loadedSubmissions = submissions
    },
    createSubmission (state, payload) {
      state.loadedSubmissions[payload.formid].push(payload.submission)
    },
    updateSubmission (state, payload) {
      const index = state.loadedSubmissions[payload.formid].findIndex(submission => {
        return submission.id === payload.submission.id
      })
      state.loadedSubmissions[payload.formid].splice(index, 1, payload.submission)
    },
    deleteSubmission (state, payload) {
      state.loadedSubmissions[payload.formid] = state.loadedSubmissions[payload.formid].filter(e => {
        return e.id !== payload.id
      })
    },

    setLoadedResponses (state, payload) {
      const submission = state.loadedSubmissions[payload.formid].find((submission) => {
        return submission.id === payload.submissionid
      })
      submission.responses = payload.responses
    },
    createResponse (state, payload) {
      const submission = state.loadedSubmissions[payload.formid].find((submission) => {
        return submission.id === payload.submissionid
      })
      submission.responses = submission.responses.slice(0)
      submission.responses.push(payload.response)
    },
    updateResponse (state, payload) {
      const submission = state.loadedSubmissions[payload.formid].find((submission) => {
        return submission.id === payload.submissionid
      })
      const index = submission.responses.findIndex(response => {
        return response.id === payload.oldId
      })
      submission.responses.splice(index, 1, payload.response)
    },
    deleteResponse (state, payload) {
      const submission = state.loadedSubmissions[payload.formid].find((submission) => {
        return submission.id === payload.submissionid
      })
      submission.responses = submission.responses.filter(e => {
        return e.id !== payload.id
      })
    }
  },
  actions: {
    loadSubmissions ({commit}, formid) {
      commit('setLoading', true)
      window.axios.get(FORM_URL + formid + SUBMISSION_URL)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formid: formid,
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
      let submission = {}
      if (payload.team_id) {
        submission.team_id = payload.team_id
      }
      if (payload.period_start) {
        submission.period_start = payload.period_start
      }
      if (payload.period_end) {
        submission.period_end = payload.period_end
      }
      window.axios.post(FORM_URL + payload.formid + SUBMISSION_URL, submission)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              formid: payload.formid,
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
      if (payload.team_id) {
        submission.team_id = payload.team_id
      }
      if (payload.period_start) {
        submission.period_start = payload.period_start
      }
      if (payload.period_end) {
        submission.period_end = payload.period_end
      }
      if (payload.status_id) {
        submission.status_id = payload.status_id
      }
      window.axios.put(FORM_URL + payload.formid + SUBMISSION_URL + payload.id, submission)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formid: payload.formid,
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
      window.axios.delete(FORM_URL + payload.formid + SUBMISSION_URL + payload.id)
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
      return (formid) => {
        if (!state.loadedSubmissions[formid]) {
          return []
        }
        return state.loadedSubmissions[formid]
      }
    },
    loadedSubmission (state) {
      return (formid, submissionid) => {
        if (!state.loadedSubmissions[formid]) {
          return null
        }
        return state.loadedSubmissions[formid].find((submission) => {
          return submission.id === submissionid
        })
      }
    },
    loadedSubmissionTeams (state, getters, rootState) {
      return (applicationid, formid) => {
        console.log(state.loadedSubmissions)
        if (!rootState.team.loadedTeams[applicationid]) {
          return []
        }
        const teams = rootState.team.loadedTeams[applicationid]
        if (!state.loadedSubmissions[formid]) {
          return teams
        }
        return teams.filter((team) => {
          const index = state.loadedSubmissions[formid].find((submission) => {
            return submission.team && submission.team.id === team.id
          })
          return index === -1
        })
      }
    }
  }
}
