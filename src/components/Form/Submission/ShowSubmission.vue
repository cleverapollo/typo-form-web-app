<template>
  <form-view :application_id='application_id' :form_id="form_id" :submission_id="submission_id"></form-view>
</template>

<script>
  import formView from '../FormView'

  export default {
    props: ['application_id', 'form_id', 'submission_id'],
    components: {
      formView
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      application () {
        return this.$store.getters.loadedApplication(parseInt(this.application_id))
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
        return this.$store.getters.loadedForm(parseInt(this.application_id), parseInt(this.id))
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
