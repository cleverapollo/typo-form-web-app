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
              formid: payload.formid,
              submissionid: payload.submissionid,
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
        answer_id: payload.answer_id
      }
      window.axios.post(SUBMISSION_URL + payload.submissionid + RESPONSE_URL, response)
        .then(
          response => {
            commit('setLoading', false)
            const createdObj = {
              formid: payload.formid,
              submissionid: payload.submissionid,
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
      if (payload.answer_id) {
        updateObj.answer_id = payload.answer_id
      }
      window.axios.put(SUBMISSION_URL + payload.submissionid + RESPONSE_URL + payload.id, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formid: payload.formid,
              submissionid: payload.submissionid,
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
    duplicateResponse ({commit}, payload) {
      commit('setLoading', true)
      window.axios.post(SUBMISSION_URL + payload.submissionid + RESPONSE_URL + payload.id)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formid: payload.formid,
              submissionid: payload.submissionid,
              responses: response['data']['responses']
            }
            commit('setLoadedResponses', updateObj)
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
      return (formid, submissionid) => {
        if (!rootState.submission.loadedSubmissions[formid]) {
          return []
        }
        const submission = rootState.submission.loadedSubmissions[formid].find((submission) => {
          return submission.id === submissionid
        })
        if (!submission) {
          return []
        }
        return submission.responses.sort((responseA, responseB) => {
          return responseA.order > responseB.order
        })
      }
    },
    loadedResponse (state, getters, rootState) {
      return (formid, submissionid, responseid) => {
        if (!rootState.submission.loadedSubmissions[formid]) {
          return null
        }
        const submission = rootState.submission.loadedSubmissions[formid].find((submission) => {
          return submission.id === submissionid
        })
        if (!submission) {
          return null
        }
        return submission.responses.find((response) => {
          return response.id === responseid
        })
      }
    }
  }
}
