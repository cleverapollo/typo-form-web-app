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
      <v-flex xs12>
        <v-card v-if="user">
          <v-card-title>
            <h1 class="primary--text ellipsis">{{ user.email }}</h1>
          </v-card-title>
          <v-card-text>
            <h3 class="break-all">{{ user.first_name }} {{ user.last_name }} - {{ getRole(user.team_role_id) }}</h3>
          </v-card-text>
          <v-card-actions v-if="userIsAdmin">
            <v-layout row wrap>
              <app-edit-teamuser :user="user" :slug="slug" :teamId="teamId" class="my-1"></app-edit-teamuser>
              <v-btn class="error my-1" @click=onDeleteTeamUser>Delete</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="info" @click=onBack class="my-1">Back</v-btn>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['slug', 'teamId', 'id'],
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      team () {
        return this.$store.getters.loadedTeam(this.slug, parseInt(this.teamId))
      },
      user () {
        return this.$store.getters.loadedTeamUser(parseInt(this.teamId), parseInt(this.id))
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
      }
    },
    methods: {
      onDeleteTeamUser () {
        this.$store.dispatch('deleteTeamUser', {
          slug: this.slug,
          teamId: this.teamId,
          id: this.user.id
        })
        this.$router.push('/' + this.slug + '/teams/show/' + this.teamId)
      },
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onBack () {
        this.$router.push('/' + this.slug + '/teams/show/' + this.teamId)
      }
    },
    created: function () {
      this.$store.dispatch('loadTeams', this.slug)
      this.$store.dispatch('loadTeamUsers', {
        slug: this.slug,
        teamId: this.teamId
      })
    }
  }
</script>
