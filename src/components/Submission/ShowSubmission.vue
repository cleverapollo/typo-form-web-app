<template>
  <show-form :application_id="application_id" :id="form_id"></show-form>
</template>

<script>
  import showForm from '../Form/ShowForm.vue'

  export default {
    props: ['application_id', 'form_id'],
    components: {
      showForm
    },
    computed: {
      application () {
        return this.$store.getters.loadedApplication(parseInt(this.application_id))
      },
      list: {
        get () {
          return this.$store.getters.loadedChildren(this.form_id, null)
        },
        set (value) {
          const updateObj = {
            id: -1,
            value: value
          }
          this.$store.dispatch('updateSection', updateObj)
        }
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated || !this.application) {
          return false
        }
        return this.application.role === 'Admin' || this.application.role === 'Super Admin'
      },
      form () {
        return this.$store.getters.loadedForm(parseInt(this.application_id), parseInt(this.form_id))
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    watch: {
      userIsAdmin (value) {
        if (value) {
          this.$router.push('/applications/' + this.application_id + '/forms/show/' + this.form_id)
        }
      }
    }
  }
</script>
