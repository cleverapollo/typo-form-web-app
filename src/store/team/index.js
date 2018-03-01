export default {
  state: {
    loadedTeams: [
    ]
  },
  mutations: {
    setLoadedTeams (state, payload) {
      state.loadedTeams = payload
    },
    createTeam (state, payload) {
      state.loadedTeams.push(payload)
    },
    updateTeam (state, payload) {
      const team = state.loadedTeams.find(team => {
        return team.id === payload.id
      })
      if (payload.title) {
        team.title = payload.title
      }
      if (payload.description) {
        team.description = payload.description
      }
    },
    deleteTeam (state, payload) {
      state.loadedTeams = state.loadedTeams.filter(e => {
        return e.id != payload.id
      })
    }
  },
  actions: {
    loadTeams ({commit}) {
      commit('setLoading', true)
      // firebase.database().ref('meetups').once('value')
      //   .then((data) => {
      //     const meetups = []
      //     const obj = data.val()
      //     for (let key in obj) {
      //       meetups.push({
      //         id: key,
      //         title: obj[key].title,
      //         description: obj[key].description,
      //         creatorId: obj[key].creatorId
      //       })
      //     }
      //     commit('setLoadedMeetups', meetups)
      //     commit('setLoading', false)
      //   })
      //   .catch(
      //     (error) => {
      //       console.log(error)
      //       commit('setLoading', false)
      //     }
      //   )
      commit('setLoading', false)
    },
    createTeam ({commit, getters}, payload) {
      const team = {
        title: payload.title,
        description: payload.description
      }
      // firebase.database().ref('meetups').push(meetup)
      //   .then((data) => {
      //     commit('createMeetup', {
      //       ...meetup,
      //       id: data.key
      //     })
      //   })
      //   .catch((error) => {
      //     console.log(error)
      //   })
      commit('createTeam', {
        title: payload.title,
        description: payload.description,
        id: 5
      })
    },
    updateTeam ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      // firebase.database().ref('meetups').child(payload.id).update(updateObj)
      //   .then(() => {
      //     commit('setLoading', false)
      //     commit('updateMeetup', payload)
      //   })
      //   .catch(error => {
      //     console.log(error)
      //     commit('setLoading', false)
      //   })
      commit('setLoading', false)
      commit('updateTeam', payload)
    },
    deleteTeam ({commit}, payload) {
      commit('setLoading', true)
      // firebase.database().ref('meetups').child(payload.id).delete()
      //   .then(() => {
      //     commit('setLoading', false)
      //     commit('deleteTeam', payload)
      //   })
      //   .catch(error => {
      //     console.log(error)
      //     commit('setLoading', false)
      //   })
      commit('setLoading', false)
      commit('deleteTeam', payload)
    }
  },
  getters: {
    loadedTeams (state) {
      return state.loadedTeams.sort((teamA, teamB) => {
        return teamA.id > teamB.id
      })
    },
    loadedTeam (state) {
      return (teamid) => {
        return state.loadedTeams.find((team) => {
          return team.id == teamid
        })
      }
    }
  }
}
