const API_URL = process.env.API_URL
const FORM_URL = `${API_URL}form/`
const SECTION_URL = '/section/'
const MOVE_URL = '/move/'

export default {
  state: {
    loadedSections: {}
  },
  mutations: {
    setLoadedSections (state, payload) {
      let sections = Object.assign({}, state.loadedSections)
      sections[payload.formid] = payload.sections
      state.loadedSections = sections
    },
    createSection (state, payload) {
      state.loadedSections[payload.formid].push(payload.section)
    },
    updateSection (state, payload) {
      const index = state.loadedSections[payload.formid].findIndex(section => {
        return section.id === payload.section.id
      })
      state.loadedSections[payload.formid].splice(index, 1, payload.section)
    },
    moveSection (state, payload) {
      if (payload.section !== null) {
        const index = state.loadedSections[payload.formid].findIndex(section => {
          return section.id === payload.section.id
        })
        state.loadedSections[payload.formid].splice(index, 1, payload.section)
      }
      const parentsectionid = payload.section ? payload.section.id : null

      const childSections = state.loadedSections[payload.formid].filter((section) => {
        return section.parent_section_id === parentsectionid && section.order >= payload.order
      })
      childSections.map(function (section) {
        section.order = section.order + 1
      })

      const section = state.loadedSections[payload.formid].find((section) => {
        return section.id === payload.sectionid
      })
      section.order = payload.order
      section.parent_section_id = parentsectionid
    },
    deleteSection (state, payload) {
      state.loadedSections[payload.formid] = state.loadedSections[payload.formid].filter(e => {
        return e.id !== payload.id
      })
    },

    setLoadedQuestions (state, payload) {
      const section = state.loadedSections[payload.formid].find((section) => {
        return section.id === payload.sectionid
      })
      section.questions = payload.questions
    },
    createQuestion (state, payload) {
      const section = state.loadedSections[payload.formid].find((section) => {
        return section.id === payload.sectionid
      })
      section.questions.push(payload.question)
    },
    duplicateQuestion (state, payload) {
      const childSections = state.loadedSections[payload.formid].filter((section) => {
        return section.parent_section_id === payload.sectionid && section.order >= payload.question.order
      })
      childSections.map(function (section) {
        section.order = section.order + 1
      })
      const section = state.loadedSections[payload.formid].find((section) => {
        return section.id === payload.sectionid
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
      const section = state.loadedSections[payload.formid].find((section) => {
        return section.id === payload.sectionid
      })
      const index = section.questions.findIndex(question => {
        return question.id === payload.question.id
      })
      section.questions.splice(index, 1, payload.question)
    },
    moveQuestion (state, payload) {
      const oldSection = state.loadedSections[payload.formid].find((section) => {
        return section.id === payload.oldsectionid
      })
      oldSection.questions = oldSection.questions.filter(e => {
        return e.id !== payload.questionid
      })

      const index = state.loadedSections[payload.formid].findIndex(section => {
        return section.id === payload.section.id
      })
      state.loadedSections[payload.formid].splice(index, 1, payload.section)

      const parentsectionid = payload.section.id
      const childSections = state.loadedSections[payload.formid].filter((section) => {
        return section.parent_section_id === parentsectionid && section.order >= payload.order
      })
      childSections.map(function (section) {
        section.order = section.order + 1
      })
    },
    deleteQuestion (state, payload) {
      const section = state.loadedSections[payload.formid].find((section) => {
        return section.id === payload.sectionid
      })
      section.questions = section.questions.filter(e => {
        return e.id !== payload.id
      })
    },
    deleteQuestions (state, payload) {
      const section = state.loadedSections[payload.formid].find((section) => {
        return section.id === payload.sectionid
      })
      section.questions = []
    },

    setLoadedAnswers (state, payload) {
      const section = state.loadedSections[payload.formid].find((section) => {
        return section.id === payload.sectionid
      })
      const question = section.questions.find((question) => {
        return question.id === payload.questionid
      })
      question.answers = payload.answers
    },
    createAnswer (state, payload) {
      const section = state.loadedSections[payload.formid].find((section) => {
        return section.id === payload.sectionid
      })
      const question = section.questions.find((question) => {
        return question.id === payload.questionid
      })
      question.answers.push(payload.answer)
    },
    updateAnswer (state, payload) {
      const section = state.loadedSections[payload.formid].find((section) => {
        return section.id === payload.sectionid
      })
      const question = section.questions.find((question) => {
        return question.id === payload.questionid
      })
      const index = question.answers.findIndex(answer => {
        return answer.id === payload.answer.id
      })
      question.answers.splice(index, 1, payload.answer)
    },
    deleteAnswer (state, payload) {
      const section = state.loadedSections[payload.formid].find((section) => {
        return section.id === payload.sectionid
      })
      const question = section.questions.find((question) => {
        return question.id === payload.questionid
      })
      question.answers = question.answers.filter(e => {
        return e.id !== payload.id
      })
    },
    deleteAnswers (state, payload) {
      const section = state.loadedSections[payload.formid].find((section) => {
        return section.id === payload.sectionid
      })
      const question = section.questions.find((question) => {
        return question.id === payload.questionid
      })
      question.answers = []
    },
    changeAnswers (state, payload) {
      const section = state.loadedSections[payload.formid].find((section) => {
        return section.id === payload.sectionid
      })
      const question = section.questions.find((question) => {
        return question.id === payload.questionid
      })
      question.answers = question.answers.filter(e => {
        return e.parameter === 1
      })
    }
  },
  actions: {
    loadSections ({commit}, formid) {
      commit('setLoading', true)
      window.axios.get(FORM_URL + formid + SECTION_URL)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formid: formid,
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
      if (payload.parent_section_id !== -1) {
        section.parent_section_id = payload.parent_section_id
      }
      window.axios.post(FORM_URL + payload.formid + SECTION_URL, section)
        .then(
          response => {
            commit('setLoading', false)
            const createObj = {
              formid: payload.formid,
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
      window.axios.put(FORM_URL + payload.formid + SECTION_URL + payload.id, payload)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formid: payload.formid,
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
      window.axios.post(FORM_URL + payload.formid + SECTION_URL + payload.sectionid + MOVE_URL, payload)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formid: payload.formid,
              sectionid: payload.sectionid,
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
      window.axios.delete(FORM_URL + payload.formid + SECTION_URL + payload.id)
        .then(() => {
          commit('setLoading', false)
          commit('deleteSection', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  },
  getters: {
    loadedSections (state) {
      return (formid) => {
        if (!state.loadedSections[formid]) {
          return []
        }
        return state.loadedSections[formid].sort((sectionA, sectionB) => {
          return sectionA.order > sectionB.order
        })
      }
    },
    loadedSection (state) {
      return (formid, sectionid) => {
        if (!state.loadedSections[formid]) {
          return null
        }
        return state.loadedSections[formid].find((section) => {
          return section.id === sectionid
        })
      }
    },
    loadedChildren (state) {
      return (formid, parentsectionid) => {
        if (!state.loadedSections[formid]) {
          return []
        }
        const childSections = state.loadedSections[formid].filter((section) => {
          return section.parent_section_id === parentsectionid
        })
        const section = state.loadedSections[formid].find((section) => {
          return section.id === parentsectionid
        })
        let childQuestions = []
        if (section) {
          childQuestions = section.questions
        }
        return [...childSections, ...childQuestions].sort((childA, childB) => {
          return childA.order > childB.order
        })
      }
    }
  }
}
