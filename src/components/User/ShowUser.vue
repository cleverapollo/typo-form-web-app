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
            <h1 class="primary--text ellipsis">{{ user.email }}</h1>
          </v-card-title>
          <v-card-text>
            <h3 class="break-all">{{ user.first_name }} {{ user.last_name }} - {{ getRole(user.application_role_id) }}</h3>
          </v-card-text>
          <v-card-actions v-if="userIsAdmin">
            <v-layout row wrap>
              <app-edit-user :user="user" :slug="slug" class="my-1"></app-edit-user>
              <v-btn class="error my-1" @click=onDeleteUser>Delete</v-btn>
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
    props: ['slug', 'id'],
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      application () {
        return this.$store.getters.loadedApplication(this.slug)
      },
      user () {
        return this.$store.getters.loadedUser(this.slug, parseInt(this.id))
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
      }
    },
    methods: {
      onDeleteUser () {
        this.$store.dispatch('deleteUser', {
          slug: this.slug,
          id: this.user.id
        })
        this.$router.push('/' + this.slug + '/users')
      },
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onBack () {
        this.$router.push('/' + this.slug + '/users')
      }
    },
    created: function () {
      this.$store.dispatch('loadUsers', this.slug)
    }
  }
</script>
