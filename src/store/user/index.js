const API_URL = process.env.API_URL
const APPLICATION_URL = `${API_URL}application/`
const USER_URL = `/user/`

export default {
  state: {
    loadedUsers: []
  },
  mutations: {
    setLoadedUsers (state, payload) {
      state.loadedUsers = payload
    },
    createUser (state, payload) {
      state.loadedUsers.push(payload)
    },
    updateUser (state, payload) {
      const user = state.loadedUsers.find(user => {
        return user.applicationid === payload.applicationid && user.id === payload.id
      })
      if (payload.name) {
        user.name = payload.name
      }
      if (payload.description) {
        user.description = payload.description
      }
    },
    deleteUser (state, payload) {
      state.loadedUsers = state.loadedUsers.filter(e => {
        return e.id !== payload.id || e.applicationid !== payload.applicationid
      })
    }
  },
  actions: {
    loadUsers ({commit}, applicationid) {
      commit('setLoading', true)
      window.axios.get(APPLICATION_URL + applicationid + USER_URL)
        .then(
          response => {
            commit('setLoading', false)
            commit('setLoadedUsers', response['data']['users'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    createUser ({commit, getters}, payload) {
      const user = {
        name: payload.name,
        description: payload.description
      }
      window.axios.post(APPLICATION_URL + payload.applicationid + USER_URL, user)
        .then(
          response => {
            commit('setLoading', false)
            commit('createUser', response['data']['user'])
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            console.log(error)
          }
        )
    },
    updateUser ({commit}, applicationid, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.name) {
        updateObj.name = payload.name
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      window.axios.put(APPLICATION_URL + applicationid + USER_URL + payload.id, updateObj)
        .then(response => {
          commit('setLoading', false)
          commit('updateUser', response['data']['user'])
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteUser ({commit}, applicationid, payload) {
      commit('setLoading', true)
      window.axios.delete(APPLICATION_URL + applicationid + USER_URL + payload.id)
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
      return state.loadedUsers.sort((userA, userB) => {
        return userA.id > userB.id
      })
    },
    loadedUser (state) {
      return (userid) => {
        return state.loadedUsers.find((user) => {
          return user.id === userid
        })
      }
    }
  }
}
