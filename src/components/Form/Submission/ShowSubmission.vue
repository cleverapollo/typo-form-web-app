<template>
  <v-layout row wrap class="pl-3">
    <v-flex d-flex>
      <form-view
        :applicationName="applicationName"
        :formId="formId"
        :submissionId="submissionId"
        :isAdmin="isAdmin"
        :view="view"
        @change-view="changeView"
      ></form-view>
    </v-flex>
  </v-layout>
</template>

<script>
  import FormView from '../FormView'

  export default {
    props: ['applicationName', 'formId', 'submissionId', 'isAdmin', 'view'],
    components: {
      FormView
    },
    computed: {
      roles () {
        return this.$store.getters.roles
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
      },
      changeView (view) {
        this.$emit('change-view', view)
      }
    }
  }
</script>
