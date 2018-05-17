<template>
  <v-layout row wrap>
    <app-invite-application :slug="slug"  v-if="userIsAdmin"></app-invite-application>
    <v-spacer></v-spacer>
    <v-btn color="info" @click=onBack>Back</v-btn>
    <v-flex xs12>
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
                <td @click=onLoadUser(props.item.id)>{{ props.item.provider }}</td>
                <td @click=onLoadUser(props.item.id)>{{ props.item.social_id }}</td>
              </template>
            </v-data-table>
          </v-tabs-content>
          <v-tabs-content
            :id="'invite'"
          >
            <v-data-table
              :headers="headers"
              :items="invitedUsers"
              hide-actions
              class="elevation-1"
              no-data-text="No invites"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.first_name }}</td>
                <td>{{ props.item.last_name }}</td>
                <td>{{ props.item.email }}</td>
                <td></td>
                <td>{{ props.item.provider }}</td>
                <td>{{ props.item.social_id }}</td>
              </template>
            </v-data-table>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    props: ['slug'],
    data () {
      return {
        active: null,
        headers: [
          { text: 'First Name', value: 'first_name', sortable: false, align: 'left' },
          { text: 'Last Name', value: 'last_name', sortable: false, align: 'left' },
          { text: 'Email', value: 'email', sortable: false, align: 'left' },
          { text: 'Role', value: 'role', sortable: false, align: 'left' },
          { text: 'Provider', value: 'role', sortable: false, align: 'left' },
          { text: 'Social ID', value: 'role', sortable: false, align: 'left' }
        ]
      }
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      application () {
        return this.$store.getters.loadedApplication(this.slug)
      },
      users () {
        return this.$store.getters.loadedUsers(this.slug)
      },
      invitedUsers () {
        return this.$store.getters.invitedUsers(this.slug)
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
        return this.getRole(this.application.application_role_id) === 'Admin'
      }
    },
    methods: {
      onLoadUser (id) {
        this.$router.push('/' + this.slug + '/users/show/' + id)
      },
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onBack () {
        this.$router.push('/' + this.slug + '/show')
      }
    },
    created: function () {
      this.$store.dispatch('loadUsers', this.slug)
    }
  }
</script>
