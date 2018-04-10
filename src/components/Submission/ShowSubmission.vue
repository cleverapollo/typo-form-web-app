<template>
  <show-form :application_id="application_id" :id="form_id" :submission_id="submission_id" :form_type="'submissions'"></show-form>
</template>

<script>
  import showForm from '../Form/ShowForm.vue'

  export default {
    props: ['application_id', 'form_id', 'submission_id'],
    components: {
      showForm
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
    created: function () {
      this.$store.dispatch('loadApplications')
      this.$store.dispatch('loadForms', this.application_id)
      this.$store.dispatch('loadSections', this.id)
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
