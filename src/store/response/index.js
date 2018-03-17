const API_URL = process.env.API_URL
const SUBMISSION_URL = `${API_URL}submission/`
const RESPONSE_URL = '/response/'

export default {
  state: {
    loadedResponses: []
  },
  mutations: {
    setLoadedResponses (state, payload) {
      state.loadedResponses = payload
    },
    createResponse (state, payload) {
      state.loadedResponses.push(payload)
    },
    updateResponse (state, payload) {
      const response = state.loadedResponses.find(response => {
        return response.id === payload.id
      })
      if (payload.name) {
        response.name = payload.name
      }
      if (payload.order) {
        response.order = payload.order
      }
    },
    deleteResponse (state, payload) {
      state.loadedResponses = state.loadedResponses.filter(e => {
        return e.id !== payload.id
      })
    }
  },
  actions: {
    loadResponses ({commit}, submissionid) {
      commit('setLoading', true)
      window.axios.get(SUBMISSION_URL + submissionid + RESPONSE_URL)
        .then(
          response => {
            commit('setLoading', false)
            commit('setLoadedResponses', response['data']['responses'])
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
        name: payload.name,
        order: payload.order
      }
      window.axios.post(SUBMISSION_URL + payload.submissionid + RESPONSE_URL, response)
        .then(
          response => {
            commit('setLoading', false)
            commit('createResponse', response['data']['response'])
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
      if (payload.name) {
        updateObj.name = payload.name
      }
      if (payload.order) {
        updateObj.order = payload.order
      }
      window.axios.put(SUBMISSION_URL + payload.submissionid + RESPONSE_URL + payload.id, updateObj)
        .then(response => {
          commit('setLoading', false)
          commit('updateResponse', response['data']['response'])
        })
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
    loadedResponses (state) {
      return state.loadedResponses.sort((responseA, responseB) => {
        return responseA.id > responseB.id
      })
    },
    loadedResponse (state) {
      return (responseid) => {
        return state.loadedResponses.find((response) => {
          return response.id === responseid
        })
      }
    }
  }
}
