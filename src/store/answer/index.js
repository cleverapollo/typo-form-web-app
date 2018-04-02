const API_URL = process.env.API_URL
const QUESTION_URL = `${API_URL}question/`
const ANSWER_URL = '/answer/'
const CHANGE_URL = 'delete'

export default {
  actions: {
    loadAnswers ({commit}, payload) {
      commit('setLoading', true)
      window.axios.get(QUESTION_URL + payload.questionid + ANSWER_URL)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              formid: payload.formid,
              sectionid: payload.sectionid,
              questionid: payload.questionid,
              answers: response['data']['answers']
            }
            commit('setLoadedAnswers', createObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    createAnswer ({commit, getters}, payload) {
      const answer = {
        answer: payload.answer,
        order: payload.order
      }
      window.axios.post(QUESTION_URL + payload.questionid + ANSWER_URL, answer)
        .then(
          response => {
            commit('setLoading', false)
            const createdObj = {
              formid: payload.formid,
              sectionid: payload.sectionid,
              questionid: payload.questionid,
              answer: response['data']['answer']
            }
            commit('createAnswer', createdObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    updateAnswer ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.answer) {
        updateObj.answer = payload.answer
      }
      if (payload.order) {
        updateObj.order = payload.order
      }
      window.axios.put(QUESTION_URL + payload.questionid + ANSWER_URL + payload.id, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formid: payload.formid,
              sectionid: payload.sectionid,
              questionid: payload.questionid,
              answer: response['data']['answer']
            }
            commit('updateAnswer', updateObj)
          }
        )
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteAnswer ({commit}, payload) {
      commit('setLoading', true)
      window.axios.delete(QUESTION_URL + payload.questionid + ANSWER_URL + payload.id)
        .then(() => {
          commit('setLoading', false)
          commit('deleteAnswer', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteAnswers ({commit}, payload) {
      commit('setLoading', true)
      window.axios.delete(QUESTION_URL + payload.questionid + ANSWER_URL)
        .then(() => {
          commit('setLoading', false)
          commit('deleteAnswers', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    changeAnswers ({commit}, payload) {
      commit('setLoading', true)
      window.axios.delete(QUESTION_URL + payload.questionid + ANSWER_URL + CHANGE_URL)
        .then(() => {
          commit('setLoading', false)
          commit('changeAnswers', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  },
  getters: {
    loadedAnswers (state, getters, rootState) {
      return (formid, sectionid, questionid) => {
        if (!rootState.section.loadedSections[formid]) {
          return []
        }
        const section = rootState.section.loadedSections[formid].find((section) => {
          return section.id === sectionid
        })
        if (!section) {
          return []
        }
        const question = section.questions.find((question) => {
          return question.id === questionid
        })
        if (!question) {
          return []
        }
        return question.answers.sort((answerA, answerB) => {
          return answerA.order > answerB.order
        })
      }
    },
    loadedAnswer (state, getters, rootState) {
      return (formid, sectionid, questionid, answerid) => {
        if (!rootState.section.loadedSections[formid]) {
          return null
        }
        const section = rootState.section.loadedSections[formid].find((section) => {
          return section.id === sectionid
        })
        if (!section) {
          return null
        }
        const question = section.questions.find((question) => {
          return question.id === questionid
        })
        if (!question) {
          return null
        }
        return question.answers.find((answer) => {
          return answer.id === answerid
        })
      }
    }
  }
}
