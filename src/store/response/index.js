const API_URL = process.env.API_URL
const SUBMISSION_URL = `${API_URL}submission/`
const RESPONSE_URL = '/response'

export default {
  actions: {
    loadResponses ({commit}, payload) {
      commit('setLoading', true)
      window.axios.get(SUBMISSION_URL + payload.submissionId + RESPONSE_URL)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              formId: payload.formId,
              submissionId: payload.submissionId,
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
        question_id: payload.questionId,
        answer_id: payload.answerId
      }

      if (payload.order) {
        response.order = payload.order
      }

      return new Promise((resolve, reject) => {
        window.axios.post(SUBMISSION_URL + payload.submissionId + RESPONSE_URL, response)
          .then(
            response => {
              commit('setLoading', false)
              const createdObj = {
                formId: payload.formId,
                submissionId: payload.submissionId,
                response: response['data']['response']
              }
              commit('createResponse', createdObj)
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
    updateResponse ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {
        response: payload.response,
        answer_id: payload.answerId,
        question_id: payload.questionId
      }
      if (payload.order) {
        updateObj.order = payload.order
      }

      return new Promise((resolve, reject) => {
        window.axios.put(SUBMISSION_URL + payload.submissionId + RESPONSE_URL + '/' + payload.id, updateObj)
          .then(
            (response) => {
              commit('setLoading', false)
              const updateObj = {
                formId: payload.formId,
                submissionId: payload.submissionId,
                oldId: payload.id,
                response: response['data']['response']
              }
              commit('updateResponse', updateObj)
              resolve(response)
            }
          )
          .catch(
            (error) => {
              console.log(error)
              commit('setLoading', false)
              reject(error)
            }
          )
      })
    },
    deleteSectionResponse ({commit}, payload) {
      commit('setLoading', true)

      return new Promise((resolve, reject) => {
        window.axios.delete(SUBMISSION_URL + payload.submissionId + RESPONSE_URL + '/section/' + payload.sectionId + '/' + payload.order)
          .then(response => {
            commit('setLoading', false)
            const createObj = {
              formId: payload.formId,
              submissionId: payload.submissionId,
              responses: response['data']['responses']
            }
            commit('setLoadedResponses', createObj)
            resolve(response)
          })
          .catch(
            error => {
              console.log(error)
              commit('setLoading', false)
              reject(error)
            }
          )
      })
    },
    deleteResponse ({commit}, payload) {
      commit('setLoading', true)

      return new Promise((resolve, reject) => {
        window.axios.delete(SUBMISSION_URL + payload.submissionId + RESPONSE_URL + '/' + payload.id)
          .then(response => {
            commit('setLoading', false)
            commit('deleteResponse', payload)
            resolve(response)
          })
          .catch(
            error => {
              console.log(error)
              commit('setLoading', false)
              reject(error)
            }
          )
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
