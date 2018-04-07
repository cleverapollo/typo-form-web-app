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
      <v-flex xs12 v-if="userIsAdmin">
        <v-card v-if="team">
          <v-card-title>
            <h1 class="primary--text">{{ team.name }}</h1>
          </v-card-title>
          <v-card-text>
            <h3>{{joinURL}}</h3>
            <h3>{{ team.description }}</h3>
            <app-invite-team :application_id="application_id" :team_id="id"></app-invite-team>
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
                      <td @click=onLoadTeamUser(props.item.id)>{{ props.item.first_name }}</td>
                      <td @click=onLoadTeamUser(props.item.id)>{{ props.item.last_name }}</td>
                      <td @click=onLoadTeamUser(props.item.id)>{{ props.item.email }}</td>
                      <td @click=onLoadTeamUser(props.item.id)>{{ getRole(props.item.team_role_id) }}</td>
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
                      <td>{{ props.item.first_name }}</td>
                      <td>{{ props.item.last_name }}</td>
                      <td>{{ props.item.email }}</td>
                      <td></td>
                    </template>
                  </v-data-table>
                </v-tabs-content>
              </v-tabs-items>
            </v-tabs>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <app-edit-team :team="team" :application_id="application_id"></app-edit-team>
            <v-btn class="error" @click=onDeleteTeam>Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 v-else>
        <v-card v-if="team">
          <v-card-title>
            <h1 class="primary--text">{{ team.name }}</h1>
          </v-card-title>
          <v-card-text>
            <h3>{{ team.description }}</h3>
            <v-data-table
              :headers="headers"
              :items="users"
              hide-actions
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <td @click=onLoadTeamUser(props.item.id)>{{ props.item.first_name }}</td>
                <td @click=onLoadTeamUser(props.item.id)>{{ props.item.last_name }}</td>
                <td @click=onLoadTeamUser(props.item.id)>{{ props.item.email }}</td>
                <td @click=onLoadTeamUser(props.item.id)>{{ getRole(props.item.team_role_id) }}</td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['application_id', 'id'],
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
      team () {
        return this.$store.getters.loadedTeam(parseInt(this.application_id), parseInt(this.id))
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
      loading () {
        return this.$store.getters.loading
      },
      users () {
        return this.$store.getters.loadedTeamUsers(parseInt(this.id))
      },
      invitedUsers () {
        return this.$store.getters.invitedTeamUsers(parseInt(this.id))
      },
      joinURL () {
        return window.origin + '/join/team/' + this.team.shareToken
      }
    },
    watch: {
      team (value) {
        if (value !== null && value !== undefined && value.shareToken === undefined) {
          this.$store.dispatch('loadTeamToken', {applicationid: this.application_id, id: this.id})
        }
      }
    },
    methods: {
      onDeleteTeam () {
        this.$store.dispatch('deleteTeam', {
          applicationid: this.application_id,
          id: this.team.id
        })
        this.$router.push('/applications/' + this.application_id + '/teams')
      },
      onLoadTeamUser (id) {
        this.$router.push('/applications/' + this.application_id + '/teams/' + this.id + '/users/' + id)
      },
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role.name
      }
    },
    created: function () {
      this.$store.dispatch('loadTeams', this.application_id)
      this.$store.dispatch('loadTeamUsers', {applicationid: this.application_id, teamid: this.id})
    }
  }
</script>
