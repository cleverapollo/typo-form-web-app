const API_URL = process.env.API_URL
const APPLICATION_URL = `${API_URL}application/`
const USER_URL = `/user`

export default {
  state: {
    loadedUsers: {}
  },
  mutations: {
    clearUsers (state) {
      state.loadedUsers = {}
    },
    setLoadedUsers (state, payload) {
      let users = Object.assign({}, state.loadedUsers)
      users[payload.slug] = payload.users
      state.loadedUsers = users
    },
    updateUser (state, payload) {
      let users = Object.assign({}, state.loadedUsers)
      const index = users[payload.slug].findIndex(user => {
        return user.id === payload.user.user_id
      })
      users[payload.slug][index].application_role_id = payload.user.application_role_id
      state.loadedUsers = users
    },
    deleteUser (state, payload) {
      let users = Object.assign({}, state.loadedUsers)
      users[payload.slug] = users[payload.slug].filter(e => {
        return e.id !== payload.id
      })
      state.loadedUsers = users
    }
  },
  actions: {
    loadUsers ({commit}, slug) {
      commit('setLoading', true)
      return new Promise((resolve, reject) => {
        window.axios.get(APPLICATION_URL + slug + USER_URL)
          .then(
            response => {
              commit('setLoading', false)
              const updateLoadedObj = {
                slug: slug,
                users: response.data.data
              }
              commit('setLoadedUsers', updateLoadedObj)
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
    updateUser ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.applicationRoleId) {
        updateObj.application_role_id = payload.applicationRoleId
      }
      if (payload.multiplier) {
        updateObj.multiplier = payload.multiplier
      }
      if (payload.period) {
        updateObj.period = payload.period
      }
      window.axios.put(APPLICATION_URL + payload.slug + USER_URL + '/' + payload.id, updateObj)
        .then(
          response => {
            commit('setLoading', false)
            const updateObj = {
              slug: payload.slug,
              user: response['data']['user']
            }
            commit('updateUser', updateObj)
          }
        )
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteUser ({commit}, payload) {
      commit('setLoading', true)
      window.axios.delete(APPLICATION_URL + payload.slug + USER_URL + '/' + payload.id)
        .then(() => {
          commit('setLoading', false)
          commit('deleteUser', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  },
  getters: {
    users: (state) => (slug) => {
      return state.loadedUsers[slug] ? state.loadedUsers[slug] : []
    },
    userByUserId: (state, getters) => (slug) => (userId) => {
      return getters.users(slug).filter(user => user.id === userId)
    },
    invitedUsers: (state, getters) => (slug) => {
      return getters.users(slug).filter(user => user.status.label === 'Invited')
    },
    // Legacy
    loadedUsers (state) {
      return (slug) => {
        if (!state.loadedUsers[slug]) {
          return []
        }
        return state.loadedUsers[slug]
      }
    },
    loadedFormUsers (state) {
      return (slug) => {
        if (!state.loadedUsers[slug]) {
          return []
        }
        return state.loadedUsers[slug].map((user) => {
          const userWithName = user
          userWithName.name = user.first_name + ' ' + user.last_name
          return userWithName
        })
      }
    },
    loadedUser (state) {
      return (slug, userId) => {
        if (!state.loadedUsers[slug]) {
          return null
        }
        return state.loadedUsers[slug].find((user) => {
          return user.id === userId
        })
      }
    }
  }
}
