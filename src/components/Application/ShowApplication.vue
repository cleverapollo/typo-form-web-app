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
        <v-card>
          <v-card-title>
            <h1 class="primary--text">{{ application.name }}</h1>
            <template v-if="userIsCreator">
              <v-spacer></v-spacer>
              <app-edit-application :application="application"></app-edit-application>
              <v-btn class="error" @click=onDeleteApplication>Delete</v-btn>
            </template>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-layout row>
                <v-flex xs12>
                  <h3 class="mt-4 mb-2">Application Users</h3>
                  <v-data-table
                    :headers="user_header"
                    :items="application.users"
                    hide-actions
                    class="elevation-1"
                  >
                    <template slot="items" slot-scope="props">
                      <td>{{ props.item.first_name }}</td>
                      <td>{{ props.item.last_name }}</td>
                      <td>{{ props.item.email }}</td>
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <h3 class="mt-4 mb-2">Application Teams</h3>
                  <v-data-table
                    :headers="team_header"
                    :items="application.teams"
                    hide-actions
                    class="elevation-1"
                  >
                    <template slot="items" slot-scope="props">
                      <td>{{ props.item.name }}</td>
                    </template>
                  </v-data-table>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['id'],
    data () {
      return {
        currentItem: 'tab-Web',
        items: [
          'Web', 'Shopping'
        ],
        user_header: [
          { text: 'First Name', value: 'first_name', sortable: false, align: 'left' },
          { text: 'Last Name', value: 'last_name', sortable: false, align: 'left' },
          { text: 'Email', value: 'email', sortable: false, align: 'left' }
        ],
        team_header: [
          { text: 'Name', value: 'name', sortable: false, align: 'left' }
        ]
      }
    },
    computed: {
      application () {
        return this.$store.getters.loadedApplication(parseInt(this.id))
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsCreator () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return true
        // return this.$store.getters.user.id === this.application.creatorId
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onDeleteApplication () {
        this.$store.dispatch('deleteApplication', {
          id: this.application.id
        })
        this.$router.push('/applications')
      }
    }
  }
</script>
