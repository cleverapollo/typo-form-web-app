const API_URL = process.env.API_URL
const QUESTION_URL = `${API_URL}question/`
const TRIGGER_URL = '/trigger/'

export default {
  actions: {
    loadTriggers ({commit}, payload) {
      commit('setLoading', true)
      window.axios.get(QUESTION_URL + payload.questionId + TRIGGER_URL)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              formId: payload.formId,
              sectionId: payload.sectionId,
              questionId: payload.questionId,
              triggers: response['data']['triggers']
            }
            commit('setLoadedTriggers', createObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    createTrigger ({commit, getters}, payload) {
      const trigger = {
        parent_question_id: payload.parentQuestionId,
        parent_answer_id: payload.parentAnswerId,
        value: payload.value,
        comparator_id: payload.comparatorId,
        order: payload.order,
        operator: payload.operator
      }
      window.axios.post(QUESTION_URL + payload.questionId + TRIGGER_URL, trigger)
        .then(
          response => {
            commit('setLoading', false)
            const createdObj = {
              formId: payload.formId,
              sectionId: payload.sectionId,
              questionId: payload.questionId,
              trigger: response['data']['trigger']
            }
            commit('createTrigger', createdObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    updateTrigger ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.parentQuestionId) {
        updateObj.parent_question_id = payload.parentQuestionId
      }
      if (payload.parentAnswer_id) {
        updateObj.parent_answer_id = payload.parentAnswer_id
      }
      if (payload.value) {
        updateObj.value = payload.value
      }
      if (payload.comparatorId) {
        updateObj.comparator_id = payload.comparatorId
      }
      if (payload.order) {
        updateObj.order = payload.order
      }
      if (payload.operator) {
        updateObj.operator = payload.operator
      }
      window.axios.put(QUESTION_URL + payload.questionId + TRIGGER_URL + payload.id, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formId: payload.formId,
              sectionId: payload.sectionId,
              questionId: payload.questionId,
              trigger: response['data']['trigger']
            }
            commit('updateTrigger', updateObj)
          }
        )
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteTrigger ({commit}, payload) {
      commit('setLoading', true)
      window.axios.delete(QUESTION_URL + payload.questionId + TRIGGER_URL + payload.id)
        .then(() => {
          commit('setLoading', false)
          commit('deleteTrigger', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  },
  getters: {
    loadedTriggers (state, getters, rootState) {
      return (formId, sectionId, questionId) => {
        if (!rootState.section.loadedSections[formId]) {
          return []
        }
        const section = rootState.section.loadedSections[formId].find((section) => {
          return section.id === sectionId
        })
        if (!section) {
          return []
        }
        const question = section.questions.find((question) => {
          return question.id === questionId
        })
        if (!question) {
          return []
        }
        return question.triggers
      }
    },
    loadedTrigger (state, getters, rootState) {
      return (formId, sectionId, questionId, triggerId) => {
        if (!rootState.section.loadedSections[formId]) {
          return null
        }
        const section = rootState.section.loadedSections[formId].find((section) => {
          return section.id === sectionId
        })
        if (!section) {
          return null
        }
        const question = section.questions.find((question) => {
          return question.id === questionId
        })
        if (!question) {
          return null
        }
        return question.triggers.find((trigger) => {
          return trigger.id === triggerId
        })
      }
    }
  }
}
