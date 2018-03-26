const API_URL = process.env.API_URL
const SECTION_URL = `${API_URL}section/`
const QUESTION_URL = '/question/'
// const QUESTION_TYPE_URL = `${API_URL}question-type/`

export default {
  state: {
    loadedQuestions: [],
    loadedQuestionTypes: []
  },
  mutations: {
    setLoadedQuestionTypes (state, payload) {
      state.loadedQuestionTypes = payload
    },
    setLoadedQuestions (state, payload) {
      state.loadedQuestions = payload
    },
    createQuestion (state, payload) {
      console.log(state, payload)
      // state.loadedSections[payload.sectionid].push(payload.question)
      state.loadedQuestions.push(payload.question)
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
    loadQuestionTypes ({commit}) {
      /* commit('setLoading', true)
      window.axios.get(QUESTION_TYPE_URL)
        .then(
          response => {
            commit('setLoading', false)
            commit('setLoadedQuestionTypes', response['data']['question_types'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        ) */
      const response = [
        {
          id: 1,
          type: 'Short Answer'
        }
      ]
      commit('setLoadedQuestionTypes', response)
    },
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
        question: payload.question,
        description: payload.description,
        mandatory: payload.mandatory,
        question_type_id: payload.question_type_id,
        order: payload.order
      }
      window.axios.post(SECTION_URL + payload.sectionid + QUESTION_URL, question)
        .then(
          response => {
            commit('setLoading', false)
            const createdObj = {
              sectionid: payload.sectionid,
              question: response['data']['question']
            }
            commit('createQuestion', createdObj)
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
    loadedQuestionTypes (state) {
      return state.loadedQuestionTypes.sort((questiontypeA, questiontypeB) => {
        return questiontypeA.id > questiontypeB.id
      })
    },
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
