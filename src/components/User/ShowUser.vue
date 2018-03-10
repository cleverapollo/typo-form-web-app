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
            <h1 class="primary--text">{{ user.name }}</h1>
            <template v-if="userIsCreator">
              <v-spacer></v-spacer>
              <app-edit-user :user="user" :application_id="application_id"></app-edit-user>
              <v-btn class="error" @click=onDeleteUser>Delete</v-btn>
            </template>
          </v-card-title>
          <v-card-text>
            <div>{{ user.description }}</div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['application_id', 'id'],
    computed: {
      user () {
        return this.$store.getters.loadedUser(parseInt(this.id))
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsCreator () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return true
        // return this.$store.getters.user.id === this.user.creatorId
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onDeleteUser () {
        this.$store.dispatch('deleteUser', {
          application_id: parseInt(this.application_id),
          id: this.form.id
        })
        this.$router.push('/applications/' + this.application_id + '/users')
      }
    },
    created: function () {
      this.$store.dispatch('loadUsers', this.application_id)
    }
  }
</script>
