<template>
  <v-container>
    <v-layout row wrap class="mb-2">
      <v-flex xs12>
        <app-invite-application :application_id="application_id"  v-if="userIsAdmin"></app-invite-application>
        <v-data-table
          :headers="headers"
          :items="users"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td @click=onLoadUser(props.item.id)>{{ props.item.first_name }}</td>
            <td @click=onLoadUser(props.item.id)>{{ props.item.last_name }}</td>
            <td @click=onLoadUser(props.item.id)>{{ props.item.email }}</td>
            <td @click=onLoadUser(props.item.id)>{{ props.item.application_pivot.role }}</td>
          </template>
        </v-data-table>
        <v-data-table
          :headers="headers"
          :items="invitedUsers"
          hide-actions
          class="elevation-1"
          v-if=invitedUsers.length > 0
        >
          <template slot="items" slot-scope="props">
            <td @click=onLoadUser(props.item.id)>{{ props.item.first_name }}</td>
            <td @click=onLoadUser(props.item.id)>{{ props.item.last_name }}</td>
            <td @click=onLoadUser(props.item.id)>{{ props.item.email }}</td>
            <td @click=onLoadUser(props.item.id)></td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    
  </v-container>
</template>

<script>
  export default {
    props: ['application_id'],
    data () {
      return {
        headers: [
          { text: 'First Name', value: 'first_name', sortable: false, align: 'left' },
          { text: 'Last Name', value: 'last_name', sortable: false, align: 'left' },
          { text: 'Email', value: 'email', sortable: false, align: 'left' },
          { text: 'Role', value: 'role', sortable: false, align: 'left' }
        ]
      }
    },
    computed: {
      application () {
        return this.$store.getters.loadedApplication(parseInt(this.application_id))
      },
      users () {
        return this.$store.getters.loadedUsers
      },
      invitedUsers () {
        return this.$store.getters.invitedUsers
      },
      loading () {
        return this.$store.getters.loading
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated || !this.application) {
          return false
        }
        return this.application.pivot.role === 'Admin' || this.application.pivot.role === 'SuperAdmin'
      }
    },
    methods: {
      onLoadUser (id) {
        this.$router.push('/applications/' + this.application_id + '/users/show/' + id)
      }
    },
    created: function () {
      this.$store.dispatch('loadApplications')
      this.$store.dispatch('loadUsers', this.application_id)
    }
  }
</script>
