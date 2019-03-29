const API_URL = process.env.API_URL
const APPLICATION_URL = `${API_URL}application/`
const NOTE_URL = `/notes`

export default {
  state: {
    loadedNotes: {}
  },
  mutations: {
    clearLoadedNotes (state) {
      state.loadedNotes = {}
    },
    setLoadedNotes (state, payload) {
      let notes = Object.assign({}, state.loadedNotes)
      notes[payload.slug] = payload.notes
      state.loadedNotes = notes
    },
    createNote (state, payload) {
      let notes = Object.assign({}, state.loadedNotes)
      if (!notes[payload.slug]) {
        notes[payload.slug] = []
      }
      notes[payload.slug].push(payload.note)
      state.loadedNotes = notes
    },
    updateNote (state, payload) {
      let notes = Object.assign({}, state.loadedNotes)
      const index = notes[payload.slug].findIndex(note => {
        return note.id === payload.note.id
      })
      notes[payload.slug].splice(index, 1, payload.note)
      state.loadedNotes = notes
    },
    deleteNote (state, payload) {
      let notes = Object.assign({}, state.loadedNotes)
      notes[payload.slug] = notes[payload.slug].filter(e => {
        return e.id !== payload.id
      })
      state.loadedNotes = notes
    }
  },
  actions: {
    loadNotes ({commit}, slug) {
      commit('setLoading', true)
      return new Promise((resolve, reject) => {
        window.axios.get(APPLICATION_URL + slug + NOTE_URL)
          .then(
            response => {
              commit('setLoading', false)
              const updateObj = {
                slug: slug,
                notes: response['data']['notes']
              }
              commit('setLoadedNotes', updateObj)
              resolve(response)
            }
          )
          .catch(
            error => {
              commit('setLoading', false)
              console.log(error)
              reject(error)
            }
          )
      })
    },
    createNote ({commit, getters}, payload) {
      commit('setLoading', true)
      return new Promise((resolve, reject) => {
        window.axios.post(APPLICATION_URL + payload.slug + NOTE_URL, payload)
          .then(
            response => {
              commit('setLoading', false)
              const createObj = {
                slug: payload.slug,
                note: response['data']['note']
              }
              commit('createNote', createObj)
              resolve(response)
            }
          )
          .catch(
            error => {
              commit('setLoading', false)
              console.log(error)
              reject(error)
            }
          )
      })
    },
    updateNote ({commit}, payload) {
      commit('setLoading', true)

      return new Promise((resolve, reject) => {
        window.axios.post(APPLICATION_URL + payload.slug + NOTE_URL + '/' + payload.id, payload)
          .then(
            response => {
              commit('setLoading', false)
              const updateObj = {
                slug: payload.slug,
                note: response['data']['note']
              }
              commit('updateNote', updateObj)
              resolve(response)
            }
          )
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
            reject(error)
          })
      })
    },
    deleteNote ({commit}, payload) {
      commit('setLoading', true)
      window.axios.delete(APPLICATION_URL + payload.slug + NOTE_URL + '/' + payload.id)
        .then(() => {
          commit('setLoading', false)
          commit('deleteNote', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  },
  getters: {
    loadedNotes (state) {
      return (slug) => {
        if (!state.loadedNotes[slug]) {
          return []
        }
        return state.loadedNotes[slug].sort((noteA, noteB) => {
          return noteA.id > noteB.id
        })
      }
    },
    loadedNote (state) {
      return (slug, noteId) => {
        if (!state.loadedNotes[slug]) {
          return null
        }
        return state.loadedNotes[slug].find((note) => {
          return note.id === noteId
        })
      }
    }
  }
}
