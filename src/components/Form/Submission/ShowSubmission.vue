<template>
  <v-layout row wrap class="pl-3">
    <v-flex xs3 d-flex v-if="submissionId > 0">
      <submissionDrawer :applicationName="applicationName" :formId="formId" :submissionId="submissionId"></submissionDrawer>
    </v-flex>

    <v-flex d-flex>
      <form-view :applicationName="applicationName" :formId="formId" :submissionId="submissionId"></form-view>
    </v-flex>
  </v-layout>
</template>

<script>
  import formView from '../FormView'
  import submissionDrawer from './SubmissionDrawer'

  export default {
    props: ['applicationName', 'formId', 'submissionId'],
    components: {
      formView,
      submissionDrawer
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      application () {
        return this.$store.getters.loadedApplication(this.applicationName)
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
      form () {
        return this.$store.getters.loadedForm(this.applicationName, parseInt(this.id))
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })

        return role ? role.name : 'undefined'
      }
    }
  }
</script>
