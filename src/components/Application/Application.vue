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
  import * as _ from 'lodash'
  export default {
    name: 'application', // todo: redirect to first page if getting application fails
    props: {
      applicationName: {
        type: String
      }
    },
    data () {
      return {
        exist: null
      }
    },
    methods: {
      checkExist () { // check if application with applicationName exists on DB
        return true
      },
      getRole (roleId) {
        if (_.isArray(this.roles)) {
          const role = this.roles.find((role) => {
            return role.id === roleId
          })
          return role ? role.name : 'undefined'
        }
        return 'undefined'
      }
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      userIsSuper () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined && this.getRole(this.$store.getters.user.role_id) === 'Super Admin'
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
    created: function () {
      this.$store.dispatch('loadApplication', this.applicationName)
    },
    mounted () {
      console.log('applicationName', this.applicationName)
      console.log('$route', this.$route)
    }
  }
</script>

<style scoped>

</style>
