<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Users</h1>
          <v-spacer></v-spacer>
          <div class="text-xs-right py-2" v-if="userIsApplicationAdmin">
            <v-tooltip bottom>
              <v-btn icon @click="editMode = !editMode" slot="activator">
                <v-icon>edit</v-icon>
              </v-btn>
              <span>Edit Page</span>
            </v-tooltip>
          </div>
        </v-flex>
        <v-flex d-flex xs12>
          <p>Select an existing user below or <a href="#" @click.stop="inviteApplication = true">add new users</a>.</p>
        </v-flex>

        <v-flex>
          <CustomSlot type="usersHeader" :mode="editMode" />
        </v-flex>
        <v-flex d-flex xs12>
          <v-card>

            <v-tabs dark slider-color="white" color="info">
              <v-tab href="#active">Active Users</v-tab>
              <v-tab href="#invited">Invited Users</v-tab>
              <v-tab-item value="active">

                <!-- //User Search -->
                <v-card-title>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-btn
                        outline
                      >
                        <download-excel
                          :data="users"
                          :name="userFileName + '.csv'"
                          type="csv"
                          :fields="userFields"
                        >
                          Export
                        </download-excel>

                      </v-btn>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        v-model="userSearch"
                        append-icon="search"
                        label="Search"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-card-title>

                <!-- //Users -->
                <v-data-table
                  :headers="userHeaders"
                  :items="users"
                  :search="userSearch"
                  :rows-per-page-items="[25, 50, 100, { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }]"
                >
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.first_name }}</td>
                    <td>{{ props.item.last_name }}</td>
                    <td>{{ props.item.email }}</td>
                    <td>{{ props.item.role }}</td>
                    <td>{{ props.item.created_at.date | moment }}</td>
                    <td>{{ props.item.updated_at.date | moment }}</td>
                    <td v-if='userIsApplicationAdmin' class="justify-center layout px-0">
                      <v-tooltip bottom>
                        <EditUser :user="props.item" :slug="slug" slot="activator"></EditUser>
                        <span>Edit</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <v-btn icon class="mx-0" @click="onDeleteUser(props.item.id)" slot="activator">
                          <v-icon color="pink">delete</v-icon>
                        </v-btn>
                        <span>Delete</span>
                      </v-tooltip>
                    </td>
                  </template>
                  <v-alert slot="no-results" :value="true" color="error" icon="warning">
                    Your search for "{{ userSearch }}" found no results.
                  </v-alert>
                </v-data-table>
              </v-tab-item>
              <v-tab-item value="invited">

                <!-- //Invited User Search -->

                <v-card-title>
                  <v-layout row wrap>
                    <v-flex xs12 md6>
                      <v-btn
                        outline
                      >
                        <download-excel
                          :data="invitedUsers"
                          :name="invitedFileName + '.csv'"
                          type="csv"
                          :fields="invitedFields"
                        >
                          Export
                        </download-excel>

                      </v-btn>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field
                        v-model="invitedUserSearch"
                        append-icon="search"
                        label="Search"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-card-title>

                <!-- //Invited Users -->
                <v-data-table
                  :headers="invitedHeaders"
                  :items="invitedUsers"
                  :search="invitedUserSearch"
                  :rows-per-page-items="[25, 50, 100, { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }]"

                >
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.email }}</td>
                    <td>{{ props.item.role }}</td>
                    <td>{{ props.item.created_at.date | moment }}</td>
                    <td v-if='userIsApplicationAdmin' class="justify-center layout px-0">
                      <v-tooltip bottom>
                        <EditInvitedUser :user="props.item" :slug="slug" slot="activator"></EditInvitedUser>
                        <span>Edit</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <v-btn icon class="mx-0" @click="onDeleteInvitedUser(props.item.id)" slot="activator">
                          <v-icon color="pink">delete</v-icon>
                        </v-btn>
                        <span>Delete</span>
                      </v-tooltip>
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

        <v-flex>
          <CustomSlot type="usersFooter" :mode="editMode" />
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
  import CustomSlot from '../Layout/CustomSlot'
  import UserMixin from '../Layout/UserMixin'
  export default {
    data () {
      return {
        userFields: {
          'First Name': 'first_name',
          'Last Name': 'last_name',
          'Email': 'email',
          'Role': 'role',
          'Joined': {
            field: 'created_at.date',
            callback: (value) => {
              return moment(value).format('YYYY-MM-DD h:MM A')
            }
          },
          'Last Active': {
            field: 'updated_at.date',
            callback: (value) => {
              return moment(value).format('YYYY-MM-DD h:MM A')
            }
          }
        },
        invitedFields: {
          'Email': 'email',
          'Role': 'role',
          'Invited': {
            field: 'created_at.date',
            callback: (value) => {
              return moment(value).format('YYYY-MM-DD h:MM A')
            }
          }
        },
        inviteApplication: false,
        userSearch: '',
        invitedUserSearch: '',
        slug: window.location.hostname.split('.')[0],
        editMode: false
      }
    },
    components: {
      InviteApplication,
      EditUser,
      EditInvitedUser,
      CustomSlot
    },
    mixins: [UserMixin],
    computed: {
      application () {
        return this.$store.getters.loadedApplication(this.slug)
      },
      users () {
        let users = this.$store.getters.loadedUsers(this.slug)
        users.forEach((user) => {
          user.role = this.getRole(user.application_role_id)
        })
        return users
      },
      invitedUsers () {
        let invitedUsers = this.$store.getters.invitedUsers(this.slug)
        invitedUsers.forEach((invitedUser) => {
          invitedUser.role = this.getRole(invitedUser.application_role_id)
        })
        return invitedUsers
      },
      userHeaders () {
        let defaultUserHeaders = [
          { text: 'First Name', value: 'first_name', sortable: true, align: 'left' },
          { text: 'Last Name', value: 'last_name', sortable: true, align: 'left' },
          { text: 'Email', value: 'email', sortable: true, align: 'left' },
          { text: 'Role', value: 'role', sortable: true, align: 'left' },
          { text: 'Joined', value: 'created_at.date', sortable: true, align: 'left' },
          { text: 'Last Active', value: 'updated_at.date', sortable: true, align: 'left' }
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
          { text: 'Invited', value: 'created_at.date', sortable: true, align: 'left' }
        ]
        if (this.userIsApplicationAdmin) {
          defaultInvitedHeaders.push({ text: 'Actions', sortable: false, align: 'center' })
        }
        return defaultInvitedHeaders
      },
      user () {
        return this.$store.getters.user
      },
      userFileName () {
        return 'Users ' + moment().format('YYYY-MM-DD [at] LTS')
      },
      invitedFileName () {
        return 'Invited Users ' + moment().format('YYYY-MM-DD [at] LTS')
      }
    },
    methods: {
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
      if (this.userIsApplicationAdmin) {
        this.$store.dispatch('loadUsers', this.slug)
      }
    },
    filters: {
      moment: function (date) {
        return moment(date).format('YYYY-MM-DD h:MM A')
      }
    }
  }
</script>
