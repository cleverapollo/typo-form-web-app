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
        return this.application.role === 'Admin' || this.application.role === 'Super Admin'
      }
    }
  }
</script>
