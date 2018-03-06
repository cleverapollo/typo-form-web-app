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
            <h1 class="primary--text">{{ application.name }}</h1>
            <template v-if="userIsCreator">
              <v-spacer></v-spacer>
              <app-edit-application :application="application"></app-edit-application>
              <v-btn class="error" @click=onDeleteApplication>Delete</v-btn>
            </template>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['id'],
    computed: {
      application () {
        return this.$store.getters.loadedApplication(parseInt(this.id))
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsCreator () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return true
        // return this.$store.getters.user.id === this.application.creatorId
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
      }
    }
  }
</script>
