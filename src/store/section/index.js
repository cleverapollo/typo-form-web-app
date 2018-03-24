const API_URL = process.env.API_URL
const FORM_URL = `${API_URL}form/`
const SECTION_URL = '/section/'

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
      state.loadedSections.splice(index, 1, payload.section)
    },
    updateQuestion (state, payload) {
      const index = state.loadedSections[payload.formid].findIndex(section => {
        return section.id === payload.section.id
      })
      state.loadedSections[payload.formid][index].questions = payload.section.questions
    },
    deleteSection (state, payload) {
      state.loadedSections = state.loadedSections[payload.formid].filter(e => {
        return e.id !== payload.id
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
      /*
      const response = [
        {
          id: 1,
          name: 'Section1',
          description: 'Section 1 Description',
          order: 1,
          parent_section_id: -1,
          form_id: 1,
          questions: [
            {
              id: 1,
              name: 'Question 1',
              order: 1
            },
            {
              id: 2,
              name: 'Question 2',
              order: 2
            }
          ]
        },
        {
          id: 2,
          name: 'Section2',
          description: 'Section 2 Description',
          order: 2,
          parent_section_id: -1,
          form_id: 1,
          questions: [
            {
              id: 3,
              name: 'Question 3',
              order: 3
            },
            {
              id: 4,
              name: 'Question 4',
              order: 4
            }
          ]
        }
      ]
      commit('setLoadedSections', response) */
    },
    createSection ({commit, getters}, payload) {
      let section = {
        name: payload.name,
        order: payload.order
      }
      if (payload.section_id !== -1) {
        section.section_id = payload.section_id
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
      /*
      const children = payload.value
      let childQuestions = []
      for (let i = 0; i < children.length; i++) {
        let child = children[i]
        child.order = i + 1
        if (typeof (child.parent_section_id) !== 'undefined') {
          child.parent_section_id = payload.id
          commit('updateSection', child)
        } else {
          childQuestions.push(child)
        }
      }
      if (payload.id !== -1) {
        const updateQuestion = {
          id: payload.id,
          questions: childQuestions
        }
        commit('updateQuestion', updateQuestion)
      } */
    },
    duplicateSection ({commit}, payload) {
      commit('setLoading', true)
      window.axios.post(FORM_URL + payload.formid + SECTION_URL + payload.id)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              formid: payload.formid,
              sections: response['data']['sections']
            }
            commit('setLoadedSections', updateObj)
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
          return section.section_id === parentsectionid
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
