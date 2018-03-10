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
        <v-card v-if="team">
          <v-card-title>
            <h1 class="primary--text">{{ team.name }}</h1>
          </v-card-title>
          <v-card-text>
            <div>{{ team.description }}</div>
          </v-card-text>
          <v-card-actions v-if="userIsAdmin">
            <v-spacer></v-spacer>
            <app-edit-team :team="team" :application_id="application_id"></app-edit-team>
            <v-btn class="error" @click=onDeleteTeam>Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['application_id', 'id'],
    computed: {
      team () {
        // return this.$store.getters.loadedTeam(parseInt(this.id))
        let loadedTeam = this.$store.getters.loadedTeam(parseInt(this.id))
        if (loadedTeam) {
          // loadedTeam.pivot.role = 'Admin'
        }
        return loadedTeam
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return true
        // return this.team.pivot.role === 'Admin'
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onDeleteTeam () {
        this.$store.dispatch('deleteTeam', {
          applicationid: this.application_id,
          id: this.team.id
        })
        this.$router.push('/applications/' + this.application_id + '/teams')
      }
    },
    created: function () {
      this.$store.dispatch('loadTeams', this.application_id)
    }
  }
</script>
