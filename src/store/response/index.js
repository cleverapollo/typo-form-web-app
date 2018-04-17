const API_URL = process.env.API_URL
const SUBMISSION_URL = `${API_URL}submission/`
const RESPONSE_URL = '/response/'

export default {
  actions: {
    loadResponses ({commit}, payload) {
      commit('setLoading', true)
      window.axios.get(SUBMISSION_URL + payload.submissionid + RESPONSE_URL)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              formId: payload.formid,
              submissionId: payload.submissionid,
              responses: response['data']['responses']
            }
            commit('setLoadedResponses', createObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    createResponse ({commit, getters}, payload) {
      const response = {
        response: payload.response,
        question_id: payload.questionid,
        answer_id: payload.answerid
      }

      if (payload.order) {
        response.order = payload.order
      }

      window.axios.post(SUBMISSION_URL + payload.submissionid + RESPONSE_URL, response)
        .then(
          response => {
            commit('setLoading', false)
            const createdObj = {
              formId: payload.formid,
              submissionId: payload.submissionid,
              response: response['data']['response']
            }
            commit('createResponse', createdObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    updateResponse ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.response) {
        updateObj.response = payload.response
      }
      if (payload.answerid) {
        updateObj.answer_id = payload.answerid
      }
      if (payload.questionid) {
        updateObj.question_id = payload.questionid
      }
      if (payload.order) {
        updateObj.order = payload.order
      }

      window.axios.put(SUBMISSION_URL + payload.submissionid + RESPONSE_URL + payload.id, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formId: payload.formid,
              submissionId: payload.submissionid,
              oldId: payload.id,
              response: response['data']['response']
            }
            commit('updateResponse', updateObj)
          }
        )
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteResponse ({commit}, payload) {
      commit('setLoading', true)
      window.axios.delete(SUBMISSION_URL + payload.submissionid + RESPONSE_URL + payload.id)
        .then(() => {
          commit('setLoading', false)
          commit('deleteResponse', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  },
  getters: {
    loadedResponses (state, getters, rootState) {
      return (formId, submissionId) => {
        if (!rootState.submission.loadedSubmissions[formId]) {
          return []
        }

        const submission = rootState.submission.loadedSubmissions[formId].find((submission) => {
          return submission.id === submissionId
        })

        if (!submission) {
          return []
        }
        return submission.responses
      }
    },
    loadedResponse (state, getters, rootState) {
      return (formId, submissionId, responseId) => {
        if (!rootState.submission.loadedSubmissions[formId]) {
          return null
        }

        const submission = rootState.submission.loadedSubmissions[formId].find((submission) => {
          return submission.id === submissionId
        })

        if (!submission) {
          return null
        }
        return submission.responses.find((response) => {
          return response.id === responseId
        })
      }
    }
  }
}
