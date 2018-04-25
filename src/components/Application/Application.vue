<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <app-edit-application v-if="userIsAdmin" :application="application" :btn-rect="false"></app-edit-application>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'application', // todo: redirect to first page if getting application fails
    props: {
      applicationName: {
        type: String
      }
    },
    methods: {
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      }
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      application () {
        return this.$store.getters.loadedApplication(this.applicationName)
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated || !this.application) {
          return false
        }
        return this.getRole(this.application.application_role_id) === 'Admin'
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      }
    },
    mounted: function () {
      if (this.application.application_role_id) {
        this.$router.push('/' + this.applicationName + '/show')
      }
    }
  }
</script>
