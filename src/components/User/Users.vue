<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Users</h1>
          <v-spacer></v-spacer>
          <div class="text-xs-right py-2" v-if="$_userIsApplicationAdmin()">
            <v-tooltip bottom>
              <v-btn icon @click="editMode = !editMode" slot="activator">
                <v-icon>edit</v-icon>
              </v-btn>
              <span>Edit Page</span>
            </v-tooltip>
          </div>
        </v-flex>
        <v-flex d-flex xs12>
          <p>Select an existing user below or <a href="#" @click.stop="invite = true">add new users</a>.</p>
        </v-flex>

        <v-flex>
          <CustomSlot type="usersHeader" :mode="editMode" />
        </v-flex>
        <v-flex d-flex xs12>
          <v-card>

            <!-- //User Search -->
            <v-card-title>
              <v-layout row wrap>
                <v-flex xs12 md6>
                  <v-btn
                    outline
                  >
                    <download-excel
                      :data="users"
                      :name="filename + '.csv'"
                      type="csv"
                    >
                      Export
                    </download-excel>

                  </v-btn>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field
                    v-model="search"
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
              :headers="headers"
              :items="users"
              :search="search"
              :rows-per-page-items="[25, 50, 100, { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }]"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.first_name }}</td>
                <td>{{ props.item.last_name }}</td>
                <td>{{ props.item.email }}</td>
                <td>{{ props.item.role }}</td>
                <td>{{ props.item.status.label }}</td>
                <td>{{ props.item.created_at | $_formatDateTime }}</td>
                <td v-if='$_userIsApplicationAdmin' class="justify-center layout px-0">
                  <v-tooltip bottom>
                    <EditUser :user="props.item" :slug="$_slug" slot="activator"></EditUser>
                    <span>Edit</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <v-btn icon class="mx-0" @click="deleteUser(props.item.id)" slot="activator">
                      <v-icon color="pink">delete</v-icon>
                    </v-btn>
                    <span>Delete</span>
                  </v-tooltip>
                </td>
              </template>
              <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search for "{{ search }}" found no results.
              </v-alert>
            </v-data-table>

          </v-card>
        </v-flex>

        <v-flex>
          <CustomSlot type="usersFooter" :mode="editMode" />
        </v-flex>
      </v-layout>
    </v-flex>

    <!-- //Action Button -->
    <v-tooltip top v-if="true">
      <v-btn slot="activator" fixed dark bottom right fab router class="red" @click.stop="invite = true">
        <v-icon>add</v-icon>
      </v-btn>
      <span>Invite Users</span>
    </v-tooltip>

    <!-- //Invite Application -->
    <InviteApplication :visible="invite" :slug="this.$_slug" @close="invite = false"></InviteApplication>
  </v-layout>
</template>

<script>
  import ApplicationMixin from '../../mixins/ApplicationMixin.js'
  import InviteApplication from '../Application/InviteApplication'
  import EditUser from './EditUser'
  import CustomSlot from '../Layout/CustomSlot'
  export default {
    mixins: [ApplicationMixin],
    components: {
      InviteApplication,
      CustomSlot,
      EditUser
    },
    data () {
      return {
        invite: false,
        search: '',
        editMode: false
      }
    },
    computed: {
      headers () {
        let headers = [
          { text: 'First Name', value: 'first_name' },
          { text: 'Last Name', value: 'last_name' },
          { text: 'Email', value: 'email' },
          { text: 'Role', value: 'role' },
          { text: 'Status', value: 'status' },
          { text: 'Created', value: 'created_at' }
        ]
        if (this.$_userIsApplicationAdmin()) {
          headers.push({ text: 'Action', sortable: false, align: 'center' })
        }
        return headers
      },
      users () {
        const users = this.$store.getters.loadedUsers(this.$_slug)
        users.forEach((user) => {
          user.role = this.$_findRole(user.application_role_id).name
        })
        return this.$store.getters.loadedUsers(this.$_slug)
      },
      filename () {
        return 'Users ' + this.$_getDateTime()
      }
    },
    methods: {
      deleteUser (index) {
        const user = this.users.find(user => { return user.id === index })
        const deleteType = user && user.inviter_id ? 'deleteInvitedUser' : 'deleteUser'
        this.$store.dispatch(deleteType, {
          slug: this.$_slug,
          id: index
        })
      }
    },
    created: function () {
      this.$store.dispatch('loadUsers', this.$_slug)
    }
  }
</script>
