const API_URL = process.env.API_URL
const FORM_URL = `${API_URL}form/`
const SECTION_URL = '/section/'

export default {
  state: {
    loadedSections: []
  },
  mutations: {
    setLoadedSections (state, payload) {
      state.loadedSections = payload
    },
    createSection (state, payload) {
      state.loadedSections.push(payload)
    },
    updateSection (state, payload) {
      const index = state.loadedSections.findIndex(section => {
        return section.id === payload.id
      })
      state.loadedSections.splice(index, 1, payload)
    },
    updateQuestion (state, payload) {
      const index = state.loadedSections.findIndex(section => {
        return section.id === payload.id
      })
      state.loadedSections[index].questions = payload.questions
    },
    deleteSection (state, payload) {
      state.loadedSections = state.loadedSections.filter(e => {
        return e.id !== payload.id
      })
    }
  },
  actions: {
    loadSections ({commit}, formid) {
      /*
      commit('setLoading', true)
      window.axios.get(FORM_URL + formid + SECTION_URL)
        .then(
          response => {
            commit('setLoading', false)
            commit('setLoadedSections', response['data']['sections'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
      */
      const response = [
        {
          id: 1,
          name: 'Section1',
          description: 'Section 1 Description',
          order: 1,
          parent_section_id: -1,
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
      commit('setLoadedSections', response)
    },
    createSection ({commit, getters}, payload) {
      const section = {
        name: payload.name,
        order: payload.order
      }
      window.axios.post(FORM_URL + payload.formid + SECTION_URL, section)
        .then(
          response => {
            commit('setLoading', false)
            commit('createSection', response['data']['section'])
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
      /*
      commit('setLoading', true)
      window.axios.put(FORM_URL + payload.formid + SECTION_URL + payload.id, payload)
        .then(response => {
          commit('setLoading', false)
          commit('updateSection', response['data']['section'])
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
      */
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
      }
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
      return state.loadedSections.sort((sectionA, sectionB) => {
        return sectionA.order > sectionB.order
      })
    },
    loadedSection (state) {
      return (sectionid) => {
        return state.loadedSections.find((section) => {
          return section.id === sectionid
        })
      }
    },
    loadedChildren (state) {
      return (parentsectionid) => {
        const childSections = state.loadedSections.filter((section) => {
          return section.parent_section_id === parentsectionid
        })
        const section = state.loadedSections.find((section) => {
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
