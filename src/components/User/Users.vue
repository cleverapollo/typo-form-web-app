<template>
  <v-container>
    <v-layout row wrap class="mb-2">
      <v-flex xs12>
        <app-invite-application :application_id="application_id"  v-if="userIsAdmin"></app-invite-application>
        <v-tabs v-model="active">
          <v-tabs-bar class="primary" dark>
            <v-tabs-item
              :href="'#member'"
              ripple
            >
              Members
            </v-tabs-item>
            <v-tabs-item
              :href="'#invite'"
              ripple
            >
              Invites
            </v-tabs-item>
          </v-tabs-bar>
          <v-tabs-items>
            <v-tabs-content
              :id="'member'"
            >
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
                  <td @click=onLoadUser(props.item.id)>{{ getRole(props.item.application_role_id) }}</td>
                </template>
              </v-data-table>
            </v-tabs-content>
            <v-tabs-content
              :id="'invite'"
            >
              <v-data-table
                :headers="headers.slice(0, 3)"
                :items="invitedUsers"
                hide-actions
                class="elevation-1"
                no-data-text="No invites"
              >
                <template slot="items" slot-scope="props">
                  <td @click=onLoadUser(props.item.id)>{{ props.item.first_name }}</td>
                  <td @click=onLoadUser(props.item.id)>{{ props.item.last_name }}</td>
                  <td @click=onLoadUser(props.item.id)>{{ props.item.email }}</td>
                </template>
              </v-data-table>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
      </v-flex>
    </v-layout>
    
  </v-container>
</template>

<script>
  export default {
    props: ['application_id'],
    data () {
      return {
        active: null,
        headers: [
          { text: 'First Name', value: 'first_name', sortable: false, align: 'left' },
          { text: 'Last Name', value: 'last_name', sortable: false, align: 'left' },
          { text: 'Email', value: 'email', sortable: false, align: 'left' },
          { text: 'Role', value: 'role', sortable: false, align: 'left' }
        ]
      }
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      application () {
        return this.$store.getters.loadedApplication(parseInt(this.application_id))
      },
      users () {
        return this.$store.getters.loadedUsers(parseInt(this.application_id))
      },
      invitedUsers () {
        return this.$store.getters.invitedUsers(parseInt(this.application_id))
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
        return this.application.application_role_id === 2
      }
    },
    methods: {
      onLoadUser (id) {
        this.$router.push('/applications/' + this.application_id + '/users/show/' + id)
      },
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role.name
      }
    },
    created: function () {
      this.$store.dispatch('loadApplications')
      this.$store.dispatch('loadUsers', this.application_id)
    }
  }
</script>
