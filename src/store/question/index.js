const API_URL = process.env.API_URL
const SECTION_URL = `${API_URL}section/`
const QUESTION_URL = '/question/'

export default {
  state: {
    loadedQuestions: []
  },
  mutations: {
    setLoadedQuestions (state, payload) {
      state.loadedQuestions = payload
    },
    createQuestion (state, payload) {
      state.loadedQuestions.push(payload)
    },
    updateQuestion (state, payload) {
      const question = state.loadedQuestions.find(question => {
        return question.id === payload.id
      })
      if (payload.name) {
        question.name = payload.name
      }
      if (payload.order) {
        question.order = payload.order
      }
    },
    deleteQuestion (state, payload) {
      state.loadedQuestions = state.loadedQuestions.filter(e => {
        return e.id !== payload.id
      })
    }
  },
  actions: {
    loadQuestions ({commit}, sectionid) {
      commit('setLoading', true)
      window.axios.get(SECTION_URL + sectionid + QUESTION_URL)
        .then(
          response => {
            commit('setLoading', false)
            commit('setLoadedQuestions', response['data']['questions'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    createQuestion ({commit, getters}, payload) {
      const question = {
        name: payload.name,
        order: payload.order
      }
      window.axios.post(SECTION_URL + payload.sectionid + QUESTION_URL, question)
        .then(
          response => {
            commit('setLoading', false)
            commit('createQuestion', response['data']['question'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    updateQuestion ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.name) {
        updateObj.name = payload.name
      }
      if (payload.order) {
        updateObj.order = payload.order
      }
      window.axios.put(SECTION_URL + payload.sectionid + QUESTION_URL + payload.id, updateObj)
        .then(response => {
          commit('setLoading', false)
          commit('updateQuestion', response['data']['question'])
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteQuestion ({commit}, payload) {
      commit('setLoading', true)
      window.axios.delete(SECTION_URL + payload.sectionid + QUESTION_URL + payload.id)
        .then(() => {
          commit('setLoading', false)
          commit('deleteQuestion', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  },
  getters: {
    loadedQuestions (state) {
      return state.loadedQuestions.sort((questionA, questionB) => {
        return questionA.id > questionB.id
      })
    },
    loadedQuestion (state) {
      return (questionid) => {
        return state.loadedQuestions.find((question) => {
          return question.id === questionid
        })
      }
    }
  }
}
