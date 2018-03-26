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
        <v-card v-if="user">
          <v-card-title>
            <h1 class="primary--text">{{ user.email }}</h1>
          </v-card-title>
          <v-card-text>
            <h3>{{ user.first_name }} {{ user.last_name }} - {{ user.team_role }}</h3>
          </v-card-text>
          <v-card-actions v-if="userIsAdmin">
            <v-spacer></v-spacer>
            <app-edit-teamuser :user="user" :application_id="application_id" :team_id="team_id"></app-edit-teamuser>
            <v-btn class="error" @click=onDeleteTeamUser>Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['application_id', 'team_id', 'id'],
    computed: {
      team () {
        return this.$store.getters.loadedTeam(parseInt(this.application_id), parseInt(this.team_id))
      },
      user () {
        return this.$store.getters.loadedTeamUser(parseInt(this.team_id), parseInt(this.id))
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return this.team.team_role === 'Admin' || this.team.team_role === 'Super Admin'
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onDeleteTeamUser () {
        this.$store.dispatch('deleteTeamUser', {
          applicationid: this.application_id,
          teamid: this.team_id,
          id: this.user.id
        })
        this.$router.push('/applications/' + this.application_id + '/teams/show/' + this.team_id)
      }
    },
    created: function () {
      this.$store.dispatch('loadTeams', this.application_id)
      this.$store.dispatch('loadTeamUsers', {
        applicationid: this.application_id,
        teamid: this.team_id
      })
    }
  }
</script>
