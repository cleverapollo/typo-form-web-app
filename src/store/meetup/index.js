// import axios from 'axios'

export default {
  state: {
    loadedMeetups: [
      {
        id: 'afajfjadfaadfa323',
        title: 'Meetup in New York',
        description: 'New York, New York!'
      },
      {
        id: 'aadsfhbkhlk1241',
        title: 'Meetup in Paris',
        description: 'It\'s Paris!'
      }
    ]
  },
  mutations: {
    setLoadedMeetups (state, payload) {
      state.loadedMeetups = payload
    },
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
    },
    updateMeetup (state, payload) {
      const meetup = state.loadedMeetups.find(meetup => {
        return meetup.id === payload.id
      })
      if (payload.title) {
        meetup.title = payload.title
      }
      if (payload.description) {
        meetup.description = payload.description
      }
    }
  },
  actions: {
    loadMeetups ({commit}) {
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
    createMeetup ({commit, getters}, payload) {
      const meetup = {
        title: payload.title,
        description: payload.description,
        creatorId: getters.user.id
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
      commit('createMeetup', Object.assign({
        meetup,
        id: Math.random()
      }))
    },
    updateMeetupData ({commit}, payload) {
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
      commit('updateMeetup', payload)
    }
  },
  getters: {
    loadedMeetups (state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    featuredMeetups (state, getters) {
      return getters.loadedMeetups.slice(0, 5)
    },
    loadedMeetup (state) {
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id === meetupId
        })
      }
    }
  }
}
