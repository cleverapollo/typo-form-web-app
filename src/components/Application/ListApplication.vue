<template>
  <v-container>
    <v-layout row wrap v-if="loading">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular
          indeterminate
          class="primary--text"
          :width="7"
          :size="70"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <v-card v-if="application">
          <v-card-title>
            <h1 class="primary--text">{{ application.name }}</h1>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="header"
              :items="items"
              hide-actions
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <td v-for="(value, key) in props.item">
                  {{ value }}
                </td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['id', 'type'],
    computed: {
      header () {
        let tableHeader = [
          { text: 'Name', value: 'name', sortable: false, align: 'left' }
        ]
        if (this.type === 'users') {
          tableHeader = [
            { text: 'First Name', value: 'first_name', sortable: false, align: 'left' },
            { text: 'Last Name', value: 'last_name', sortable: false, align: 'left' },
            { text: 'Email', value: 'email', sortable: false, align: 'left' }
          ]
        }
        return tableHeader
      },
      items () {
        let tableItems = []
        if (this.application) {
          if (this.type === 'users') {
            tableItems = this.application.user
          } else if (this.type === 'teams') {
            tableItems = this.application.team
          } else if (this.type === 'forms') {
            tableItems = this.application.form
          }
        }
        return tableItems
      },
      application () {
        // return this.$store.getters.loadedApplication(parseInt(this.id))
        let loadedApplication = this.$store.getters.loadedApplication(parseInt(this.id))
        if (loadedApplication) {
          loadedApplication.pivot.role = 'Admin'
        }
        return loadedApplication
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return this.application.pivot.role === 'Admin'
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    created: function () {
      if (this.type === 'users') {
        this.$store.dispatch('loadUsers', this.id)
      } else if (this.type === 'teams') {
        this.$store.dispatch('loadTeams', this.id)
      } else if (this.type === 'forms') {
        this.$store.dispatch('loadForms', this.id)
      }
    }
  }
</script>
