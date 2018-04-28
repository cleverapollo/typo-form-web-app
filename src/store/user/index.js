const API_URL = process.env.API_URL
const APPLICATION_URL = `${API_URL}application/`
const USER_URL = `/user/`

export default {
  state: {
    loadedUsers: {},
    invitedUsers: {}
  },
  mutations: {
    setLoadedUsers (state, payload) {
      let users = Object.assign({}, state.loadedUsers)
      users[payload.slug] = payload.users
      state.loadedUsers = users
    },
    setInvitedUsers (state, payload) {
      let users = Object.assign({}, state.invitedUsers)
      users[payload.slug] = payload.users
      state.invitedUsers = users
    },
    updateUser (state, payload) {
      let users = Object.assign({}, state.loadedUsers)
      const index = users[payload.slug].findIndex(user => {
        return user.id === payload.user.id
      })
      users[payload.slug].splice(index, 1, payload.user)
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
      window.axios.get(APPLICATION_URL + slug + USER_URL)
        .then(
          response => {
            commit('setLoading', false)
            const updateLoadedObj = {
              slug: slug,
              users: response['data']['users']['current']
            }
            commit('setLoadedUsers', updateLoadedObj)

            const updateInvitedObj = {
              slug: slug,
              users: response['data']['users']['unaccepted']
            }
            commit('setInvitedUsers', updateInvitedObj)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    updateUser ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.applicationRoleId) {
        updateObj.application_role_id = payload.applicationRoleId
      }
      window.axios.put(APPLICATION_URL + payload.slug + USER_URL + payload.id, updateObj)
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
      window.axios.delete(APPLICATION_URL + payload.slug + USER_URL + payload.id)
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
    loadedUsers (state) {
      return (slug) => {
        if (!state.loadedUsers[slug]) {
          return []
        }
        return state.loadedUsers[slug].sort((userA, userB) => {
          return userA.id > userB.id
        })
      }
    },
    invitedUsers (state) {
      return (slug) => {
        if (!state.invitedUsers[slug]) {
          return []
        }
        return state.invitedUsers[slug].sort((userA, userB) => {
          return userA.id > userB.id
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
