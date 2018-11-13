const API_URL = process.env.API_URL
const FORM_URL = `${API_URL}form/`
const TRIGGER_URL = '/trigger'

export default {
  state: {
    loadedTriggers: []
  },
  mutations: {
    clearLoadedTriggers (state) {
      state.loadedTriggers = {}
    },
    setLoadedTriggers (state, payload) {
      let triggers = Object.assign({}, state.loadedTriggers)
      triggers[payload.formId] = payload.triggers
      state.loadedTriggers = triggers
    },
    createTrigger (state, payload) {
      let triggers = Object.assign({}, state.loadedTriggers)
      if (!triggers[payload.formId]) {
        triggers[payload.formId] = []
      }
      triggers[payload.formId].push(payload.trigger)
      state.loadedTriggers = triggers
    },
    updateTrigger (state, payload) {
      let triggers = Object.assign({}, state.loadedTriggers)
      const index = triggers[payload.formId].findIndex(trigger => {
        return trigger.id === payload.trigger.id
      })
      triggers[payload.formId].splice(index, 1, payload.trigger)
      state.loadedTriggers = triggers
    },
    deleteTrigger (state, payload) {
      let triggers = Object.assign({}, state.loadedTriggers)
      triggers[payload.formId] = triggers[payload.formId].filter(e => {
        return e.id !== payload.id
      })
      state.loadedTriggers = triggers
    }
  },
  actions: {
    loadTriggers ({commit}, formId) {
      commit('setLoading', true)
      window.axios.get(FORM_URL + formId + TRIGGER_URL)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              formId: formId,
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
        type: payload.type,
        question_id: payload.questionId,
        parent_question_id: payload.parentQuestionId,
        comparator_id: payload.comparatorId,
        operator: payload.operator,
        value: ''
      }
      window.axios.post(FORM_URL + payload.formId + TRIGGER_URL, trigger)
        .then(
          response => {
            commit('setLoading', false)
            const createdObj = {
              formId: payload.formId,
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
      if (payload.type) {
        updateObj.type = payload.type
      }
      if (payload.parentQuestionId) {
        updateObj.parent_question_id = payload.parentQuestionId
      }
      if (payload.parentAnswerId !== undefined) {
        updateObj.parent_answer_id = payload.parentAnswerId
      }
      if (payload.value !== undefined) {
        updateObj.value = payload.value
      }
      if (payload.comparatorId) {
        updateObj.comparator_id = payload.comparatorId
      }
      if (payload.operator !== undefined) {
        updateObj.operator = payload.operator
      }
      window.axios.put(FORM_URL + payload.formId + TRIGGER_URL + '/' + payload.id, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formId: payload.formId,
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
      window.axios.delete(FORM_URL + payload.formId + TRIGGER_URL + '/' + payload.id)
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
    loadedTriggers (state) {
      return (formId) => {
        if (!state.loadedTriggers[formId]) {
          return []
        }
        return state.loadedTriggers[formId]
      }
    },
    loadedTrigger (state) {
      return (formId, triggerId) => {
        if (!state.loadedTriggers[formId]) {
          return null
        }
        return state.loadedTriggers[formId].find((trigger) => {
          return trigger.id === triggerId
        })
      }
    },
    loadedQuestionTrigger (state) {
      return (formId, questionId) => {
        if (!state.loadedTriggers[formId]) {
          return []
        }
        return state.loadedTriggers[formId].filter((trigger) => {
          return trigger.question_id === questionId
        })
      }
    }
  }
}
