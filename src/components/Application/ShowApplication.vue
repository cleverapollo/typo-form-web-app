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
              <v-list-tile v-for="item in items" :key="item.title" @click="onList(item.type)">
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.title"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card-text>
          <v-card-actions v-if="userIsAdmin">
            <app-invite-application :application="application"></app-invite-application>
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
        // return this.$store.getters.loadedApplication(parseInt(this.id))
        let loadedApplication = this.$store.getters.loadedApplication(parseInt(this.id))
        if (loadedApplication) {
          loadedApplication.pivot.role = 'Admin'
        }
        return loadedApplication
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return this.application.pivot.role === 'Admin'
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
      }
    },
    created: function () {
      this.$store.dispatch('loadApplications')
    }
  }
</script>
