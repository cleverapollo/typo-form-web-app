<template>
  <v-container>
    <v-layout row wrap v-if="loading">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular
          indeterminate
          class="primary--text"
          :width="7"
          :size="70"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <v-card v-if="application">
          <v-card-title>
            <h1 class="primary--text">{{ application.name }}</h1>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-tile v-for="item in items" :key="item.title" @click="onList(item.type)" v-if="showUsersToAdmin(item.type)">
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.title"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card-text>
          <v-card-actions v-if="userIsAdmin">
            <v-spacer></v-spacer>
            <app-edit-application :application="application"></app-edit-application>
            <v-btn class="error" @click=onDeleteApplication>Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['id'],
    data () {
      return {
        items: [
          { title: 'User List', type: 'users' },
          { title: 'Team List', type: 'teams' },
          { title: 'Form List', type: 'forms' }
        ]
      }
    },
    computed: {
      application () {
        return this.$store.getters.loadedApplication(parseInt(this.id))
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated) {
          return false
        }
        // return this.application.pivot.role === 'Admin' || this.application.pivot.role === 'SuperAdmin'
        return true
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onDeleteApplication () {
        this.$store.dispatch('deleteApplication', {
          id: this.application.id
        })
        this.$router.push('/applications')
      },
      onList (type) {
        this.$router.push('/applications/' + this.id + '/' + type)
      },
      showUsersToAdmin (type) {
        return type !== 'users' || this.userIsAdmin
      }
    },
    created: function () {
      this.$store.dispatch('loadApplications')
    }
  }
</script>
