const API_URL = process.env.API_URL
const SECTION_URL = `${API_URL}section/`
const QUESTION_URL = '/question/'
const QUESTION_TYPE_URL = `${API_URL}question-type/`

export default {
  state: {
    loadedQuestionTypes: []
  },
  mutations: {
    setLoadedQuestionTypes (state, payload) {
      state.loadedQuestionTypes = payload
    }
  },
  actions: {
    loadQuestionTypes ({commit}) {
      commit('setLoading', true)
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
        )
    },
    loadQuestions ({commit}, payload) {
      commit('setLoading', true)
      window.axios.get(SECTION_URL + payload.sectionid + QUESTION_URL)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              formid: payload.formid,
              sectionid: payload.sectionid,
              questions: response['data']['questions']
            }
            commit('setLoadedQuestions', createObj)
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
              formid: payload.formid,
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
      if (payload.question) {
        updateObj.question = payload.question
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      if (payload.question_type_id) {
        updateObj.question_type_id = payload.question_type_id
      }
      if (payload.mandatory) {
        updateObj.mandatory = payload.mandatory
      }
      if (payload.order) {
        updateObj.order = payload.order
      }
      window.axios.put(SECTION_URL + payload.sectionid + QUESTION_URL + payload.id, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formid: payload.formid,
              sectionid: payload.sectionid,
              question: response['data']['question']
            }
            commit('updateQuestion', updateObj)
          }
        )
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    duplicateQuestion ({commit}, payload) {
      commit('setLoading', true)
      window.axios.post(SECTION_URL + payload.sectionid + QUESTION_URL + payload.id)
        .then(
          response => {
            commit('setLoading', false)
            const createdObj = {
              formid: payload.formid,
              sectionid: payload.sectionid,
              question: response['data']['question']
            }
            commit('duplicateQuestion', createdObj)
          }
        )
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
    loadedQuestions (state, getters, rootState) {
      return (formid, sectionid) => {
        if (!rootState.section.loadedSections[formid]) {
          return []
        }
        const section = rootState.section.loadedSections[formid].find((section) => {
          return section.id === sectionid
        })
        if (!section) {
          return []
        }
        return section.questions.sort((questionA, questionB) => {
          return questionA.order > questionB.order
        })
      }
    },
    loadedQuestion (state, getters, rootState) {
      return (formid, sectionid, questionid) => {
        if (!rootState.section.loadedSections[formid]) {
          return null
        }
        const section = rootState.section.loadedSections[formid].find((section) => {
          return section.id === sectionid
        })
        if (!section) {
          return null
        }
        return section.questions.find((question) => {
          return question.id === questionid
        })
      }
    }
  }
}
