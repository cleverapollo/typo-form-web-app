<template>
  <v-layout row wrap v-if='organisation'>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">{{ organisation.name }}</h1>
          <div class="text-xs-right">
            <v-menu offset-y bottom left v-if="isOrganisationAdmin">
              <v-btn icon slot="activator">
                <v-icon>more_vert</v-icon>
              </v-btn>

              <v-list>
                <v-list-tile @click="">
                  <v-list-tile-avatar>
                    <v-icon>edit</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <EditOrganisation :organisation="organisation" :slug="slug" class="my-1"></EditOrganisation>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-tile @click.stop="deleteOrganisation = true">
                  <v-list-tile-avatar>
                    <v-icon>delete</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    Delete Organisation
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-menu>
          </div>
        </v-flex>
        <v-flex xs12>
          <div class="subheading py-2 px-3 break-all">{{ organisation.description }}</div>
          <div class="subheading py-2 px-3 break-all" v-if="isOrganisationAdmin">{{ joinURL }}</div>
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
                    <td v-if='isOrganisationAdmin' class="justify-center layout px-0">
                      <v-tooltip bottom>
                        <EditOrganisationUser :user="props.item" :slug="slug" :organisationId="id" slot="activator"></EditOrganisationUser>
                        <span>Edit</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <v-btn icon class="mx-0" @click="onDeleteOrganisationUser(props.item.id)" slot="activator">
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
                    <td>{{ props.item.invitee }}</td>
                    <td>{{ props.item.role }}</td>
                    <td>{{ props.item.created_at.date | moment }}</td>
                    <td v-if='isOrganisationAdmin' class="justify-center layout px-0">
                      <v-tooltip bottom>
                        <EditInvitedOrganisationUser :user="props.item" :slug="slug" :organisationId="id" slot="activator"></EditInvitedOrganisationUser>
                        <span>Edit</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <v-btn icon class="mx-0" @click="onDeleteInvitedOrganisationUser(props.item.id)" slot="activator">
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
      </v-layout>
    </v-flex>

    <v-tooltip top v-if="isOrganisationAdmin">
      <v-btn slot="activator" fixed dark bottom right fab router class="error" @click.stop="inviteUsers = true">
        <v-icon>add</v-icon>
      </v-btn>
      <span>Invite Users</span>
    </v-tooltip>

    <!-- //Invite Organisation -->
    <InviteOrganisation :slug="slug" :organisationId="id" :visible="inviteUsers" @close="inviteUsers = false"></InviteOrganisation>

    <!-- //Delete Organisation -->
    <DeleteConfirmDialog @delete-action="onDeleteOrganisation" :visible="deleteOrganisation" @close="deleteOrganisation = false"></DeleteConfirmDialog>
  </v-layout>
</template>

<script>
  import InviteOrganisation from './InviteOrganisation'
  import EditOrganisation from './EditOrganisation'
  import EditOrganisationUser from './EditOrganisationUser'
  import EditInvitedOrganisationUser from './EditInvitedOrganisationUser'
  import moment from 'moment'
  export default {
    props: ['id'],
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
          }
        },
        invitedFields: {
          'Email': 'invitee',
          'Role': 'role',
          'Invited': {
            field: 'created_at.date',
            callback: (value) => {
              return moment(value).format('YYYY-MM-DD h:MM A')
            }
          }
        },
        userSearch: '',
        invitedUserSearch: '',
        inviteUsers: false,
        deleteOrganisation: false,
        slug: window.location.hostname.split('.')[0]
      }
    },
    components: {
      InviteOrganisation,
      EditOrganisation,
      EditOrganisationUser,
      EditInvitedOrganisationUser
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      organisation () {
        return this.$store.getters.loadedOrganisation(this.slug, parseInt(this.id))
      },
      isOrganisationAdmin () {
        return this.userIsAdmin || this.isSuperUser
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated || !this.organisation) {
          return false
        }
        return this.getRole(this.organisation.organisation_role_id) === 'Admin'
      },
      isSuperUser () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return this.getRole(this.$store.getters.user.role_id) === 'Super Admin'
      },
      users () {
        let users = this.$store.getters.loadedOrganisationUsers(parseInt(this.id))
        users.forEach((user) => {
          user.role = this.getRole(user.organisation_role_id)
        })
        return users
      },
      invitedUsers () {
        let invitedUsers = this.$store.getters.invitedOrganisationUsers(parseInt(this.id))
        invitedUsers.forEach((invitedUser) => {
          invitedUser.role = this.getRole(invitedUser.organisation_role_id)
        })
        return invitedUsers
      },
      joinURL () {
        return window.location.origin + '/join/organisation/' + this.organisation.share_token
      },
      userHeaders () {
        let defaultUserHeaders = [
          { text: 'First Name', value: 'first_name', sortable: true, align: 'left' },
          { text: 'Last Name', value: 'last_name', sortable: true, align: 'left' },
          { text: 'Email', value: 'email', sortable: true, align: 'left' },
          { text: 'Role', value: 'role', sortable: true, align: 'left' },
          { text: 'Joined', value: 'created_at.date', sortable: true, align: 'left' }
        ]
        if (this.isOrganisationAdmin) {
          defaultUserHeaders.push({ text: 'Action', sortable: false, align: 'center' })
        }
        return defaultUserHeaders
      },
      invitedHeaders () {
        let defaultInvitedHeaders = [
          { text: 'Email', value: 'invitee', sortable: true, align: 'left' },
          { text: 'Role', value: 'role', sortable: true, align: 'left' },
          { text: 'Invited', value: 'created_at.date', sortable: true, align: 'left' }
        ]
        if (this.isOrganisationAdmin) {
          defaultInvitedHeaders.push({ text: 'Action', sortable: false, align: 'center' })
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
      onDeleteOrganisation () {
        this.$store.dispatch('deleteOrganisation', {
          slug: this.slug,
          id: this.organisation.id
        })
        this.$router.push('/organisations')
      },
      onDeleteOrganisationUser (organisationUserId) {
        this.$store.dispatch('deleteOrganisationUser', {
          slug: this.slug,
          organisationId: this.organisation.id,
          id: organisationUserId
        })
          .then(() => {
            if (this.user.id === organisationUserId) {
              this.$store.dispatch('loadOrganisations', this.slug)
                .then(() => {
                  this.$router.push('/organisations')
                })
            }
          })
      },
      onDeleteInvitedOrganisationUser (organisationUserId) {
        this.$store.dispatch('deleteInvitedOrganisationUser', {
          slug: this.slug,
          organisationId: this.organisation.id,
          id: organisationUserId
        })
      },
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      }
    },
    created: function () {
      this.$store.dispatch('loadOrganisations', this.slug)
      this.$store.dispatch('loadOrganisationUsers', {slug: this.slug, organisationId: this.id})
    },
    filters: {
      moment: function (date) {
        return moment(date).format('YYYY-MM-DD h:MM A')
      }
    }
  }
</script>
