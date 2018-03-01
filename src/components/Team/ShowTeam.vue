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
        <v-card>
          <v-card-title>
            <h1 class="primary--text">{{ team.title }}</h1>
            <template>
              <v-spacer></v-spacer>
              <app-edit-team :team="team"></app-edit-team>
              <v-btn class="error" @click=onDeleteTeam>Delete</v-btn>
            </template>
          </v-card-title>
          <v-card-text>
            <div>{{ team.description }}</div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['id'],
    computed: {
      team () {
        return this.$store.getters.loadedTeam(this.id)
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onDeleteTeam () {
        this.$store.dispatch('deleteTeam', {
          id: this.id
        })
        this.$router.push('/teams')
      }
    }
  }
</script>
