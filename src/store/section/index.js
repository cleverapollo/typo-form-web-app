const API_URL = process.env.API_URL
const FORM_URL = `${API_URL}form/`
const SECTION_URL = '/section/'
const MOVE_URL = '/move/'

export default {
  state: {
    loadedSections: {},
    selectedSection: null
  },
  mutations: {
    setLoadedSections (state, payload) {
      let sections = Object.assign({}, state.loadedSections)
      sections[payload.formId] = payload.sections
      state.loadedSections = sections
    },
    createSection (state, payload) {
      let sections = Object.assign({}, state.loadedSections)
      sections[payload.formId].push(payload.section)
      state.loadedSections = sections
    },
    updateSection (state, payload) {
      let sections = Object.assign({}, state.loadedSections)
      const index = sections[payload.formId].findIndex(section => {
        return section.id === payload.section.id
      })
      sections[payload.formId].splice(index, 1, payload.section)
      state.loadedSections = sections
    },
    moveSection (state, payload) {
      const parentSectionId = payload.section ? payload.section.id : null
      if (payload.section !== null) {
        const index = state.loadedSections[payload.formId].findIndex(section => {
          return section.id === parentSectionId
        })
        state.loadedSections[payload.formId].splice(index, 1, payload.section)
      }

      const childSections = state.loadedSections[payload.formId].filter((section) => {
        return section.parent_section_id === parentSectionId && section.order >= payload.order
      })
      childSections.map(function (section) {
        section.order = section.order + 1
      })

      const section = state.loadedSections[payload.formId].find((section) => {
        return section.id === payload.sectionId
      })
      section.order = payload.order
      section.parent_section_id = parentSectionId
    },
    deleteSection (state, payload) {
      let sections = Object.assign({}, state.loadedSections)
      sections[payload.formId] = sections[payload.formId].filter(e => {
        return e.id !== payload.id
      })
      state.loadedSections = sections
    },
    selectSection (state, payload) {
      state.selectedSection = payload
    },

    setLoadedQuestions (state, payload) {
      let sections = Object.assign({}, state.loadedSections)
      const section = sections[payload.formId].find((section) => {
        return section.id === payload.sectionId
      })
      section.questions = payload.questions
      state.loadedSections = sections
    },
    createQuestion (state, payload) {
      let sections = Object.assign({}, state.loadedSections)
      const section = sections[payload.formId].find((section) => {
        return section.id === payload.sectionId
      })
      section.questions.push(payload.question)
      state.loadedSections = sections
    },
    duplicateQuestion (state, payload) {
      const childSections = state.loadedSections[payload.formId].filter((section) => {
        return section.parent_section_id === payload.sectionId && section.order >= payload.question.order
      })
      childSections.map(function (section) {
        section.order = section.order + 1
      })
      const section = state.loadedSections[payload.formId].find((section) => {
        return section.id === payload.sectionId
      })
      if (section) {
        section.questions.map(function (question) {
          if (question.order >= payload.question.order) {
            question.order = question.order + 1
          }
        })
      }
      section.questions.push(payload.question)
    },
    updateQuestion (state, payload) {
      let sections = Object.assign({}, state.loadedSections)
      const section = sections[payload.formId].find((section) => {
        return section.id === payload.sectionId
      })
      const index = section.questions.findIndex(question => {
        return question.id === payload.question.id
      })
      section.questions.splice(index, 1, payload.question)
      state.loadedSections = sections
    },
    moveQuestion (state, payload) {
      const oldSection = state.loadedSections[payload.formId].find((section) => {
        return section.id === payload.oldSectionId
      })
      oldSection.questions = oldSection.questions.filter(e => {
        return e.id !== payload.questionId
      })

      const index = state.loadedSections[payload.formId].findIndex(section => {
        return section.id === payload.section.id
      })
      state.loadedSections[payload.formId].splice(index, 1, payload.section)

      const parentSectionId = payload.section.id
      const childSections = state.loadedSections[payload.formId].filter((section) => {
        return section.parent_section_id === parentSectionId && section.order >= payload.order
      })
      childSections.map(function (section) {
        section.order = section.order + 1
      })
    },
    deleteQuestion (state, payload) {
      let sections = Object.assign({}, state.loadedSections)
      const section = sections[payload.formId].find((section) => {
        return section.id === payload.sectionId
      })
      section.questions = section.questions.filter(e => {
        return e.id !== payload.id
      })
      state.loadedSections = sections
    },
    deleteQuestions (state, payload) {
      let sections = Object.assign({}, state.loadedSections)
      const section = sections[payload.formId].find((section) => {
        return section.id === payload.sectionId
      })
      section.questions = []
      state.loadedSections = sections
    },

    setLoadedAnswers (state, payload) {
      let sections = Object.assign({}, state.loadedSections)
      const section = sections[payload.formId].find((section) => {
        return section.id === payload.sectionId
      })
      const question = section.questions.find((question) => {
        return question.id === payload.questionId
      })
      question.answers = payload.answers
      state.loadedSections = sections
    },
    createAnswer (state, payload) {
      let sections = Object.assign({}, state.loadedSections)
      const section = sections[payload.formId].find((section) => {
        return section.id === payload.sectionId
      })
      const question = section.questions.find((question) => {
        return question.id === payload.questionId
      })
      question.answers.push(payload.answer)
      state.loadedSections = sections
    },
    updateAnswer (state, payload) {
      let sections = Object.assign({}, state.loadedSections)
      const section = sections[payload.formId].find((section) => {
        return section.id === payload.sectionId
      })
      const question = section.questions.find((question) => {
        return question.id === payload.questionId
      })
      const index = question.answers.findIndex(answer => {
        return answer.id === payload.answer.id
      })
      question.answers.splice(index, 1, payload.answer)
      state.loadedSections = sections
    },
    deleteAnswer (state, payload) {
      let sections = Object.assign({}, state.loadedSections)
      const section = sections[payload.formId].find((section) => {
        return section.id === payload.sectionId
      })
      const question = section.questions.find((question) => {
        return question.id === payload.questionId
      })
      question.answers = question.answers.filter(e => {
        return e.id !== payload.id
      })
      state.loadedSections = sections
    },
    deleteAnswers (state, payload) {
      let sections = Object.assign({}, state.loadedSections)
      const section = sections[payload.formId].find((section) => {
        return section.id === payload.sectionId
      })
      const question = section.questions.find((question) => {
        return question.id === payload.questionId
      })
      question.answers = []
      state.loadedSections = sections
    },
    changeAnswers (state, payload) {
      let sections = Object.assign({}, state.loadedSections)
      const section = sections[payload.formId].find((section) => {
        return section.id === payload.sectionId
      })
      const question = section.questions.find((question) => {
        return question.id === payload.questionId
      })
      question.answers = question.answers.filter(e => {
        return e.parameter === 1
      })
      state.loadedSections = sections
    }
  },
  actions: {
    loadSections ({commit}, formId) {
      commit('setLoading', true)
      window.axios.get(FORM_URL + formId + SECTION_URL)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formId: formId,
              sections: response['data']['sections']
            }
            commit('setLoadedSections', updateObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    createSection ({commit, getters}, payload) {
      let section = {
        name: payload.name
      }
      if (payload.parentSectionId !== -1) {
        section.parent_section_id = payload.parentSectionId
      }
      window.axios.post(FORM_URL + payload.formId + SECTION_URL, section)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              formId: payload.formId,
              section: response['data']['section']
            }
            commit('createSection', createObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    updateSection ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.name) {
        updateObj.name = payload.name
      }
      if (payload.parentSectionId !== -1) {
        updateObj.parent_section_id = payload.parentSectionId
      }
      if (payload.repeatable !== undefined) {
        updateObj.repeatable = payload.repeatable
      }
      if (payload.min_rows !== undefined) {
        updateObj.min_rows = payload.min_rows
      }
      if (payload.max_rows !== undefined) {
        updateObj.max_rows = payload.max_rows
      }
      window.axios.put(FORM_URL + payload.formId + SECTION_URL + payload.id, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formId: payload.formId,
              section: response['data']['section']
            }
            commit('updateSection', updateObj)
          }
        )
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    moveSection ({commit}, payload) {
      commit('setLoading', true)
      const moveObj = {
        parent_section_id: payload.parentSectionId,
        order: payload.order
      }
      window.axios.post(FORM_URL + payload.formId + SECTION_URL + payload.sectionId + MOVE_URL, moveObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formId: payload.formId,
              sectionId: payload.sectionId,
              order: payload.order,
              section: response['data']['data']
            }
            commit('moveSection', updateObj)
          }
        )
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteSection ({commit}, payload) {
      commit('setLoading', true)
      window.axios.delete(FORM_URL + payload.formId + SECTION_URL + payload.id)
        .then(() => {
          commit('setLoading', false)
          commit('deleteSection', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    selectSection ({commit}, payload) {
      commit('selectSection', payload)
    }
  },
  getters: {
    loadedSections (state) {
      return (formId) => {
        if (!state.loadedSections[formId]) {
          return []
        }
        return state.loadedSections[formId].sort((sectionA, sectionB) => {
          return sectionA.order > sectionB.order
        })
      }
    },
    loadedSection (state) {
      return (formId, sectionId) => {
        if (!state.loadedSections[formId]) {
          return null
        }
        return state.loadedSections[formId].find((section) => {
          return section.id === sectionId
        })
      }
    },
    loadedChildren (state) {
      return (formId, parentSectionId) => {
        if (!state.loadedSections[formId]) {
          return []
        }
        const childSections = state.loadedSections[formId].filter((section) => {
          return section.parent_section_id === parentSectionId
        })
        const section = state.loadedSections[formId].find((section) => {
          return section.id === parentSectionId
        })
        let childQuestions = []
        if (section) {
          childQuestions = section.questions
        }
        return [...childSections, ...childQuestions].sort((childA, childB) => {
          return childA.order > childB.order
        })
      }
    },
    loadSelectedSection (state) {
      return () => {
        return state.selectedSection
      }
    }
  }
}
