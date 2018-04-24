<template>
  <v-container>
    <v-layout row wrap class="mb-2">
      <v-flex xs12 style="position: relative">
        <v-btn
          absolute
          bottom
          right
          dark
          fab
          router
          @click=onCreateForm()
          class="primary"
          v-if="userIsAdmin"
        >
          <v-icon>add</v-icon>
        </v-btn>
        <v-btn
          color="info"
          @click=onBack>
          Back
        </v-btn>
        <v-data-table
          :headers="headers"
          :items="forms"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td @click=onLoadForm(props.item.id)>{{ props.item.name }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['applicationName'],
    data () {
      return {
        headers: [
          { text: 'Name', value: 'name', sortable: false, align: 'left' }
        ]
      }
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
      forms () {
        return this.$store.getters.loadedForms(this.applicationName)
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
      onLoadForm (id) {
        this.$router.push('/' + this.applicationName + '/forms/show/' + id)
      },
      onCreateForm () {
        this.$router.push('/' + this.applicationName + '/forms/new')
      },
      onBack () {
        this.$router.push('/' + this.applicationName + '/show')
      }
    },
    created: function () {
      this.$store.dispatch('loadApplications')
      this.$store.dispatch('loadForms', this.applicationName)
    }
  }
</script>
