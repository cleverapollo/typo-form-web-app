<template>
  <v-layout row wrap v-if='team'>
    <v-flex d-flex sm12 md10 offset-md1 xl8 offset-xl2>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <div class="subheading py-2 px-3">{{ team.name }}</div>
          <v-menu offset-y bottom left class="text-xs-right" v-if="isTeamAdmin">
            <v-btn icon slot="activator">
              <v-icon>more_vert</v-icon>
            </v-btn>

            <v-list>
              <v-list-tile @click="">
                <v-list-tile-title>
                  <app-edit-team :team="team" :slug="slug" class="my-1"></app-edit-team>
                </v-list-tile-title>
              </v-list-tile>

              <v-list-tile @click="onDeleteTeam">
                <v-list-tile-title>Delete Team</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-flex>
        <v-flex xs12>
          <div class="subheading py-2 px-3 break-all">{{ team.description }}</div>
          <div class="subheading py-2 px-3 break-all">{{ joinURL }}</div>
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
                    <td>{{ props.item.created_at.date }}</td>
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

    <!-- //Invite Team -->
    <InviteTeam :slug="slug" :teamId="id"></InviteTeam>
  </v-layout>
</template>

<script>
  import InviteTeam from './InviteTeam'
  export default {
    props: ['slug', 'id'],
    data () {
      return {
        userSearch: '',
        invitedUserSearch: '',
        userHeaders: [
          { text: 'First Name', value: 'first_name', sortable: true, align: 'left' },
          { text: 'Last Name', value: 'last_name', sortable: true, align: 'left' },
          { text: 'Email', value: 'email', sortable: true, align: 'left' },
          { text: 'Role', value: 'role', sortable: true, align: 'left' },
          { text: 'Joined', value: 'created_at', sortable: true, align: 'left' }
        ],
        invitedHeaders: [
          { text: 'Email', value: 'email', sortable: true, align: 'left' },
          { text: 'Role', value: 'role', sortable: true, align: 'left' },
          { text: 'Invited', value: 'created_at', sortable: true, align: 'left' }
        ]
      }
    },
    components: {
      InviteTeam
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      team () {
        return this.$store.getters.loadedTeam(this.slug, parseInt(this.id))
      },
      isTeamAdmin () {
        return this.team && this.getRole(this.team.team_role_id) === 'Admin'
      },
      users () {
        return this.$store.getters.loadedTeamUsers(parseInt(this.id))
      },
      invitedUsers () {
        return this.$store.getters.invitedTeamUsers(parseInt(this.id))
      },
      joinURL () {
        return window.origin + '/join/team/' + this.team.share_token
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
      onLoadTeamUser (id) {
        this.$router.push('/' + this.slug + '/teams/' + this.id + '/users/' + id)
      },
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onBack () {
        this.$router.push('/' + this.slug + '/teams')
      }
    },
    created: function () {
      this.$store.dispatch('loadTeams', this.slug)
      this.$store.dispatch('loadTeamUsers', {slug: this.slug, teamId: this.id})
    }
  }
</script>
