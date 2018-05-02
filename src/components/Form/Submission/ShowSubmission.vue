<template>
  <v-layout row wrap class="pl-3">
    <v-flex d-flex>
      <form-view
        :slug="slug"
        :formId="formId"
        :submissionId="submissionId"
        :isAdmin="isAdmin"
        :view="view"
      ></form-view>
    </v-flex>
  </v-layout>
</template>

<script>
  import FormView from '../FormView'

  export default {
    props: ['slug', 'formId', 'submissionId', 'isAdmin', 'view'],
    components: {
      FormView
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      form () {
        return this.$store.getters.loadedForm(this.slug, parseInt(this.id))
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
