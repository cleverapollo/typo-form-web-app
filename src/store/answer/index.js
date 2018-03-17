const API_URL = process.env.API_URL
const QUESTION_URL = `${API_URL}question/`
const ANSWER_URL = '/answer/'

export default {
  state: {
    loadedAnswers: []
  },
  mutations: {
    setLoadedAnswers (state, payload) {
      state.loadedAnswers = payload
    },
    createAnswer (state, payload) {
      state.loadedAnswers.push(payload)
    },
    updateAnswer (state, payload) {
      const answer = state.loadedAnswers.find(answer => {
        return answer.id === payload.id
      })
      if (payload.name) {
        answer.name = payload.name
      }
      if (payload.order) {
        answer.order = payload.order
      }
    },
    deleteAnswer (state, payload) {
      state.loadedAnswers = state.loadedAnswers.filter(e => {
        return e.id !== payload.id
      })
    }
  },
  actions: {
    loadAnswers ({commit}, questionid) {
      commit('setLoading', true)
      window.axios.get(QUESTION_URL + questionid + ANSWER_URL)
        .then(
          response => {
            commit('setLoading', false)
            commit('setLoadedAnswers', response['data']['answers'])
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
        name: payload.name,
        order: payload.order
      }
      window.axios.post(QUESTION_URL + payload.questionid + ANSWER_URL, answer)
        .then(
          response => {
            commit('setLoading', false)
            commit('createAnswer', response['data']['answer'])
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
      if (payload.name) {
        updateObj.name = payload.name
      }
      if (payload.order) {
        updateObj.order = payload.order
      }
      window.axios.put(QUESTION_URL + payload.questionid + ANSWER_URL + payload.id, updateObj)
        .then(response => {
          commit('setLoading', false)
          commit('updateAnswer', response['data']['answer'])
        })
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
    }
  },
  getters: {
    loadedAnswers (state) {
      return state.loadedAnswers.sort((answerA, answerB) => {
        return answerA.id > answerB.id
      })
    },
    loadedAnswer (state) {
      return (answerid) => {
        return state.loadedAnswers.find((answer) => {
          return answer.id === answerid
        })
      }
    }
  }
}
