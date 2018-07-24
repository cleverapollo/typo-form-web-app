<template>
  <v-layout row wrap v-if='team'>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <div class="subheading py-2 px-3">{{ team.name }}</div>
          <div class="text-xs-right">
            <v-menu offset-y bottom left v-if="isTeamAdmin">
              <v-btn icon slot="activator">
                <v-icon>more_vert</v-icon>
              </v-btn>

              <v-list>
                <v-list-tile @click="">
                  <v-list-tile-avatar>
                    <v-icon>edit</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <EditTeam :team="team" :slug="slug" class="my-1"></EditTeam>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-tile @click.stop="deleteTeam = true">
                  <v-list-tile-avatar>
                    <v-icon>delete</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    Delete Team
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-menu>
          </div>
        </v-flex>
        <v-flex xs12>
          <div class="subheading py-2 px-3 break-all">{{ team.description }}</div>
          <div class="subheading py-2 px-3 break-all" v-if="isTeamAdmin">{{ joinURL }}</div>
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
                    <td>{{ getRole(props.item.team_role_id) }}</td>
                    <td>{{ props.item.created_at.date | moment }}</td>
                    <td v-if='isTeamAdmin' class="justify-center layout px-0">
                      <EditTeamUser :user="props.item" :slug="slug" :teamId="id"></EditTeamUser>
                      <v-btn icon class="mx-0" @click="onDeleteTeamUser(props.item.id)">
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
                    <td>{{ getRole(props.item.team_role_id) }}</td>
                    <td>{{ props.item.created_at.date | moment }}</td>
                    <td v-if='isTeamAdmin' class="justify-center layout px-0">
                      <EditInvitedTeamUser :user="props.item" :slug="slug" :teamId="id"></EditInvitedTeamUser>
                      <v-btn icon class="mx-0" @click="onDeleteInvitedTeamUser(props.item.id)">
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

    <v-tooltip top v-if="isTeamAdmin">
      <v-btn slot="activator" fixed dark bottom right fab router class="error" @click.stop="inviteUsers = true">
        <v-icon>add</v-icon>
      </v-btn>
      <span>Invite Users</span>
    </v-tooltip>

    <!-- //Invite Team -->
    <InviteTeam :slug="slug" :teamId="id" :visible="inviteUsers" @close="inviteUsers = false"></InviteTeam>

    <!-- //Delete Team -->
    <DeleteConfirmDialog @delete-action="onDeleteTeam" :visible="deleteTeam" @close="deleteTeam = false"></DeleteConfirmDialog>
  </v-layout>
</template>

<script>
  import InviteTeam from './InviteTeam'
  import EditTeam from './EditTeam'
  import EditTeamUser from './EditTeamUser'
  import EditInvitedTeamUser from './EditInvitedTeamUser'
  import moment from 'moment'
  export default {
    props: ['slug', 'id'],
    data () {
      return {
        userSearch: '',
        invitedUserSearch: '',
        inviteUsers: false,
        deleteTeam: false
      }
    },
    components: {
      InviteTeam,
      EditTeam,
      EditTeamUser,
      EditInvitedTeamUser
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      team () {
        return this.$store.getters.loadedTeam(this.slug, parseInt(this.id))
      },
      isTeamAdmin () {
        return this.userIsAdmin || this.isSuperUser
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated || !this.team) {
          return false
        }
        return this.getRole(this.team.team_role_id) === 'Admin'
      },
      isSuperUser () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return this.getRole(this.$store.getters.user.role_id) === 'Super Admin'
      },
      users () {
        return this.$store.getters.loadedTeamUsers(parseInt(this.id))
      },
      invitedUsers () {
        return this.$store.getters.invitedTeamUsers(parseInt(this.id))
      },
      joinURL () {
        return window.location.origin + '/join/team/' + this.team.share_token
      },
      userHeaders () {
        let defaultUserHeaders = [
          { text: 'First Name', value: 'first_name', sortable: true, align: 'left' },
          { text: 'Last Name', value: 'last_name', sortable: true, align: 'left' },
          { text: 'Email', value: 'email', sortable: true, align: 'left' },
          { text: 'Role', value: 'role', sortable: true, align: 'left' },
          { text: 'Joined', value: 'created_at', sortable: true, align: 'left' }
        ]
        if (this.isTeamAdmin) {
          defaultUserHeaders.push({ text: 'Action', sortable: false, align: 'center' })
        }
        return defaultUserHeaders
      },
      invitedHeaders () {
        let defaultInvitedHeaders = [
          { text: 'Email', value: 'email', sortable: true, align: 'left' },
          { text: 'Role', value: 'role', sortable: true, align: 'left' },
          { text: 'Invited', value: 'created_at', sortable: true, align: 'left' }
        ]
        if (this.isTeamAdmin) {
          defaultInvitedHeaders.push({ text: 'Action', sortable: false, align: 'center' })
        }
        return defaultInvitedHeaders
      },
      user () {
        return this.$store.getters.user
      }
    },
    methods: {
      onDeleteTeam () {
        this.$store.dispatch('deleteTeam', {
          slug: this.slug,
          id: this.team.id
        })
        this.$router.push('/' + this.slug + '/teams')
      },
      onDeleteTeamUser (teamUserId) {
        this.$store.dispatch('deleteTeamUser', {
          slug: this.slug,
          teamId: this.team.id,
          id: teamUserId
        })
          .then(() => {
            if (this.user.id === teamUserId) {
              this.$store.dispatch('loadTeams', this.slug)
                .then(() => {
                  this.$router.push('/' + this.slug + '/teams')
                })
            }
          })
      },
      onDeleteInvitedTeamUser (teamUserId) {
        this.$store.dispatch('deleteInvitedTeamUser', {
          slug: this.slug,
          teamId: this.team.id,
          id: teamUserId
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
      this.$store.dispatch('loadTeams', this.slug)
      this.$store.dispatch('loadTeamUsers', {slug: this.slug, teamId: this.id})
    },
    filters: {
      moment: function (date) {
        return moment(date).format('YYYY-MM-DD h:MM A')
      }
    }
  }
</script>
