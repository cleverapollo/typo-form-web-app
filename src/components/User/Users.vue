<template>
  <v-layout row wrap>
    <v-flex d-flex sm12 md10 offset-md1 xl8 offset-xl2>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <div class="subheading py-2 px-3">Users</div>
        </v-flex>
        <v-flex d-flex xs12>
          <v-card>

            <v-tabs dark slider-color="white" color="info">
              <v-tab href="#active">Active Users</v-tab>
              <v-tab href="#invited">Invited Users</v-tab>
              <v-tab-item id="active">

                <!-- //User Search -->
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="userSearch"
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details
                  >
                  </v-text-field>
                </v-card-title>

                <!-- //Users -->
                <v-data-table
                  :headers="userHeaders"
                  :items="users"
                  :search="userSearch"
                >
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.first_name }}</td>
                    <td>{{ props.item.last_name }}</td>
                    <td>{{ props.item.email }}</td>
                    <td>{{ getRole(props.item.application_role_id) }}</td>
                    <td>{{ props.item.created_at.date | moment }}</td>
                    <td v-if='userIsApplicationAdmin' class="justify-center layout px-0">
                      <EditUser :user="props.item" :slug="slug"></EditUser>
                      <v-btn icon class="mx-0" @click="onDeleteUser(props.item.id)">
                        <v-icon color="pink">delete</v-icon>
                      </v-btn>
                    </td>
                  </template>
                  <v-alert slot="no-results" :value="true" color="error" icon="warning">
                    Your search for "{{ userSearch }}" found no results.
                  </v-alert>
                </v-data-table>
              </v-tab-item>
              <v-tab-item id="invited">

                <!-- //Invited User Search -->
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="invitedUserSearch"
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details
                  >
                  </v-text-field>
                </v-card-title>

                <!-- //Invited Users -->
                <v-data-table
                  :headers="invitedHeaders"
                  :items="invitedUsers"
                  :search="invitedUserSearch"
                >
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.invitee }}</td>
                    <td>{{ getRole(props.item.role_id) }}</td>
                    <td>{{ props.item.created_at }}</td>
                    <td v-if='userIsApplicationAdmin' class="justify-center layout px-0">
                      <EditInvitedUser :user="props.item" :slug="slug"></EditInvitedUser>
                      <v-btn icon class="mx-0" @click="onDeleteInvitedUser(props.item.id)">
                        <v-icon color="pink">delete</v-icon>
                      </v-btn>
                    </td>
                  </template>
                  <v-alert slot="no-results" :value="true" color="error" icon="warning">
                    Your search for "{{ invitedUserSearch }}" found no results.
                  </v-alert>
                </v-data-table>
              </v-tab-item>
            </v-tabs>

          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

    <!-- //Action Button -->
    <v-tooltip top v-if="userIsApplicationAdmin">
      <v-btn slot="activator" fixed dark bottom right fab router class="red" @click.stop="inviteApplication = true">
        <v-icon>add</v-icon>
      </v-btn>
      <span>Invite Users</span>
    </v-tooltip>

    <!-- //Invite Application -->
    <InviteApplication :visible="inviteApplication" :slug="slug" @close="inviteApplication = false"></InviteApplication>
  </v-layout>
</template>

<script>
  import InviteApplication from '../Application/InviteApplication'
  import EditUser from './EditUser'
  import EditInvitedUser from './EditInvitedUser'
  import moment from 'moment'
  export default {
    props: ['slug'],
    data () {
      return {
        inviteApplication: false,
        userSearch: '',
        invitedUserSearch: ''
      }
    },
    components: {
      InviteApplication,
      EditUser,
      EditInvitedUser
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      application () {
        return this.$store.getters.loadedApplication(this.slug)
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsApplicationAdmin () {
        return this.userIsAdmin || this.isSuperUser
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated || !this.application) {
          return false
        }
        return this.getRole(this.application.application_role_id) === 'Admin'
      },
      isSuperUser () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return this.getRole(this.$store.getters.user.role_id) === 'Super Admin'
      },
      users () {
        return this.$store.getters.loadedUsers(this.slug)
      },
      invitedUsers () {
        return this.$store.getters.invitedUsers(this.slug)
      },
      userHeaders () {
        let defaultUserHeaders = [
          { text: 'First Name', value: 'first_name', sortable: true, align: 'left' },
          { text: 'Last Name', value: 'last_name', sortable: true, align: 'left' },
          { text: 'Email', value: 'email', sortable: true, align: 'left' },
          { text: 'Role', value: 'role', sortable: true, align: 'left' },
          { text: 'Joined', value: 'created_at', sortable: true, align: 'left' }
        ]
        if (this.userIsApplicationAdmin) {
          defaultUserHeaders.push({ text: 'Actions', sortable: false, align: 'center' })
        }
        return defaultUserHeaders
      },
      invitedHeaders () {
        let defaultInvitedHeaders = [
          { text: 'Email', value: 'email', sortable: true, align: 'left' },
          { text: 'Role', value: 'role', sortable: true, align: 'left' },
          { text: 'Invited', value: 'created_at', sortable: true, align: 'left' }
        ]
        if (this.userIsApplicationAdmin) {
          defaultInvitedHeaders.push({ text: 'Actions', sortable: false, align: 'center' })
        }
        return defaultInvitedHeaders
      },
      user () {
        return this.$store.getters.user
      }
    },
    methods: {
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onDeleteUser (userIndex) {
        this.$store.dispatch('deleteUser', {
          slug: this.slug,
          id: userIndex
        })
          .then(() => {
            if (this.user.id === userIndex) {
              this.$store.dispatch('loadApplications')
                .then(() => {
                  this.$router.push('/applications')
                })
            }
          })
      },
      onDeleteInvitedUser (userIndex) {
        this.$store.dispatch('deleteInvitedUser', {
          slug: this.slug,
          id: userIndex
        })
      }
    },
    created: function () {
      this.$store.dispatch('loadUsers', this.slug)
    },
    filters: {
      moment: function (date) {
        return moment(date).format('YYYY-MM-DD h:MM A')
      }
    }
  }
</script>