<template>
  <v-layout row justify-space-around>
    <v-flex xs12>
      <v-card>
        <v-card-text class="primary">
          <div class="title font-weight-regular white--text">{{ getGreeting(this.user.first_name )}}</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 md4>
              <span class="body-2">Role: </span>
              <span>{{ getUserApplicationRole() }}</span>
            </v-flex>
            <v-flex xs12 md4 text-md-center>
              <span class="body-2">Email: </span>
              <span>{{ this.user.email }}</span>
            </v-flex>
            <v-flex xs12 md4 text-md-right>
              <span class="body-2">Joined: </span>
              <span>{{ getUserApplicationJoined(this.user.id) }}</span>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import * as _ from 'lodash'
import moment from 'moment'
export default {
  computed: {
    slug () {
      return window.location.hostname.split('.')[0]
    },
    user () {
      return this.$store.getters.user
    },
    application () {
      return this.$store.getters.loadedApplication(this.slug)
    },
    roles () {
      return this.$store.getters.roles
    }
  },
  methods: {
    getUserName (userId) {
      let user = _.find(this.users, user => {
        return user.id === userId
      })
      return user ? user.first_name + ' ' + user.last_name : 'System Administrator'
    },
    getGreeting (name) {
      let today = new Date()
      let curHr = today.getHours()
      let greeting = null

      if (curHr < 12) {
        greeting = 'Good morning'
      } else if (curHr < 18) {
        greeting = 'Good afternoon'
      } else {
        greeting = 'Good evening'
      }

      return greeting + ', ' + name
    },
    getUserApplicationRole () {
      return this.isSuperUser ? 'Super Admin' : this.getRole(this.application.application_role_id)
    },
    getRole (roleId) {
      const role = this.roles.find((role) => {
        return role.id === roleId
      })
      return role ? role.name : 'undefined'
    },
    getUserApplicationJoined (userId) {
      if (this.userIsAdmin) {
        let user = _.find(this.$store.getters.loadedUsers(this.slug), user => {
          return user.id === userId
        })
        return user ? this.getTimeSince(user.created_at.date) : 'N/A'
      } else {
        return this.user && this.user.created_at ? this.getTimeSince(this.user.created_at.date) : 'N/A'
      }
    },
    getTimeSince (time) {
      return moment(time).fromNow()
    },
    isSuperUser () {
      return this.user && this.getRole(this.user.role_id) === 'Super Admin'
    }
  }
}
</script>

<style>

</style>
