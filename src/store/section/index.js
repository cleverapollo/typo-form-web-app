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
      const section = state.loadedSections.find(section => {
        return section.formid === payload.formid && section.id === payload.id
      })
      if (payload.name) {
        section.name = payload.name
      }
      if (payload.order) {
        section.order = payload.order
      }
    },
    deleteSection (state, payload) {
      state.loadedSections = state.loadedSections.filter(e => {
        return e.id !== payload.id || e.formid !== payload.formid
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
            commit('setLoadedSections', response['data']['sections'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    createSection ({commit, getters}, formid, payload) {
      const section = {
        name: payload.name,
        order: payload.order
      }
      window.axios.post(FORM_URL + formid + SECTION_URL, section)
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
    updateSection ({commit}, formid, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.name) {
        updateObj.name = payload.name
      }
      if (payload.order) {
        updateObj.order = payload.order
      }
      window.axios.put(FORM_URL + formid + SECTION_URL + payload.id, updateObj)
        .then(response => {
          commit('setLoading', false)
          commit('updateSection', response['data']['section'])
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteSection ({commit}, formid, payload) {
      commit('setLoading', true)
      window.axios.delete(FORM_URL + formid + SECTION_URL + payload.id)
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
        return state.loadedSections.find((section) => {
          return section.formid === formid
        })
        .sort((sectionA, sectionB) => {
          return sectionA.id > sectionB.id
        })
      }
    },
    loadedSection (state) {
      return (formid, sectionid) => {
        return state.loadedSections.find((section) => {
          return section.id === sectionid && section.formid === formid
        })
      }
    }
  }
}
