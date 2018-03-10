const API_URL = process.env.API_URL
const FORM_URL = `${API_URL}submission/`
const SUBMISSION_URL = 'submission/'

export default {
  state: {
    loadedSubmissions: []
  },
  mutations: {
    setLoadedSubmissions (state, payload) {
      state.loadedSubmissions = payload
    },
    createSubmission (state, payload) {
      state.loadedSubmissions.push(payload)
    },
    updateSubmission (state, payload) {
      const submission = state.loadedSubmissions.find(submission => {
        return submission.formid === payload.formid && submission.id === payload.id
      })
      if (payload.name) {
        submission.name = payload.name
      }
      if (payload.order) {
        submission.order = payload.order
      }
    },
    deleteSubmission (state, payload) {
      state.loadedSubmissions = state.loadedSubmissions.filter(e => {
        return e.id !== payload.id || e.formid !== payload.formid
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
            commit('setLoadedSubmissions', response['data']['submissions'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    createSubmission ({commit, getters}, formid, payload) {
      const submission = {
        name: payload.name,
        order: payload.order
      }
      window.axios.post(FORM_URL + formid + SUBMISSION_URL, submission)
        .then(
          response => {
            commit('setLoading', false)
            commit('createSubmission', response['data']['submission'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    updateSubmission ({commit}, formid, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.name) {
        updateObj.name = payload.name
      }
      if (payload.order) {
        updateObj.order = payload.order
      }
      window.axios.put(FORM_URL + formid + SUBMISSION_URL + payload.id, updateObj)
        .then(response => {
          commit('setLoading', false)
          commit('updateSubmission', response['data']['submission'])
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteSubmission ({commit}, formid, payload) {
      commit('setLoading', true)
      window.axios.delete(FORM_URL + formid + SUBMISSION_URL + payload.id)
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
        return state.loadedSubmissions.find((submission) => {
          return submission.formid === formid
        })
        .sort((submissionA, submissionB) => {
          return submissionA.id > submissionB.id
        })
      }
    },
    loadedSubmission (state) {
      return (formid, submissionid) => {
        return state.loadedSubmissions.find((submission) => {
          return submission.id === submissionid && submission.formid === formid
        })
      }
    }
  }
}
