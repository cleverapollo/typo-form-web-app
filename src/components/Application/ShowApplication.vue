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
            <h3 class="break-all" v-if=userIsAdmin>{{joinURL}}</h3>
            <v-list>
              <v-list-tile v-for="item in items" :key="item.title" @click="onList(item.type)" v-if="showUsersToAdmin(item.type)">
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.title"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card-text>
          <v-card-actions v-if="userIsAdmin">
            <v-layout row wrap>
              <app-edit-application :application="application" class="my-1"></app-edit-application>
              <v-btn class="error my-1" @click=onDeleteApplication>Delete</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="info" @click=onBack class="my-1">Back</v-btn>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['application_name'],
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
      roles () {
        return this.$store.getters.roles
      },
      application () {
        return this.$store.getters.loadedApplication(this.application_name)
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated || !this.application) {
          return false
        }
        return this.getRole(this.application.application_role_id) === 'Admin'
      },
      loading () {
        return this.$store.getters.loading
      },
      joinURL () {
        return window.origin + '/join/application/' + this.application.share_token
      }
    },
    methods: {
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onDeleteApplication () {
        this.$store.dispatch('deleteApplication', {
          id: this.application.id
        })
        this.$router.push('/applications')
      },
      onList (type) {
        this.$router.push('/' + this.application_name + '/' + type)
      },
      showUsersToAdmin (type) {
        return type !== 'users' || this.userIsAdmin
      },
      onBack () {
        this.$router.push('/applications')
      }
    },
    created: function () {
      this.$store.dispatch('loadApplications')
    }
  }
</script>
