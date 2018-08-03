<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>

        <!-- //Title -->
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Dashboard</h1>
          <v-spacer></v-spacer>

          <div class="text-xs-right">

            <!-- //Share Link -->
            <v-dialog v-model="joinUrlDialog" persistent max-width="600">
              <v-btn slot="activator" icon v-if="userIsApplicationAdmin">
                <v-icon>share</v-icon>
              </v-btn>
              <v-card>
                <!-- //Title -->
                <v-card-title>
                  <div class="title mb-2 mt-2">Share Application</div>
                </v-card-title>
                
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs12 pb-3>Invite other users to this application by sharing the following link.</v-flex>
                    <v-flex xs12 class="wrap-text">{{ joinURL }}</v-flex>
                  </v-layout>
                </v-card-text>

                <v-divider></v-divider>
                <v-card-actions>
                  <v-layout row py-2>
                    <v-flex xs12 class="text-xs-right">
                      <v-btn color="primary" @click="joinUrlDialog = false" >Close</v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-actions>
              </v-card>
            </v-dialog>


            <v-menu offset-y bottom left v-if="userIsApplicationAdmin">
              <v-btn icon slot="activator">
                <v-icon>more_vert</v-icon>
              </v-btn>

              <v-list>
                <v-list-tile @click="">
                  <v-list-tile-avatar>
                    <v-icon>edit</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <EditApplication :application="application" class="my-1"></EditApplication>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-tile @click.stop="deleteApplication = true">
                  <v-list-tile-avatar>
                    <v-icon>delete</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    Delete Application
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-menu>
          </div>

        </v-flex>
      </v-layout>
    </v-flex>
  
    <!-- //Dashboard Widgets -->
    <v-flex xs12>
      <v-layout row wrap>
        <v-flex xs12>
          <v-container fluid grid-list-md>
            <v-layout row wrap>

              <v-flex
                pointer
                @click="onList(item.type)"
                v-for="item in items"
                v-if="!item.admin || userIsApplicationAdmin"
                :key="item.title"
                sm12 md3>
                <v-card :color="item.color" class="white--text">
                  <v-container fluid grid-list-lg>
                    <v-layout row>
                      <v-flex xs3>
                        <v-icon size="65">{{ item.icon }}</v-icon>
                      </v-flex>
                      <v-flex xs9 text-xs-right>
                        <div class="display-2">
                          <countTo :startVal="countToStart" :endVal="getPropertyCount(item.type)" :duration="countToDuration"></countTo>
                        </div>
                        <div class="medium">{{ item.title }}</div>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card>
              </v-flex>

            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-flex>

    <!-- //Delete Application -->
    <DeleteConfirmDialog @delete-action="onDeleteApplication" :visible="deleteApplication" @close="deleteApplication = false"></DeleteConfirmDialog>

  </v-layout>
</template>

<script>
  import EditApplication from './EditApplication'
  import SettingApplication from './SettingApplication'
  import countTo from 'vue-count-to'
  export default {
    props: ['slug'],
    data () {
      return {
        items: [
          { title: 'Submissions', type: 'submissions', icon: 'assignment', color: 'green', admin: false },
          { title: 'Forms', type: 'forms', icon: 'content_paste', color: 'orange', admin: true },
          { title: 'Users', type: 'users', icon: 'person', color: 'blue', admin: true },
          { title: 'Teams', type: 'teams', icon: 'people', color: 'purple', admin: false }
        ],
        countToStart: 0,
        countToDuration: 3000,
        joinUrlDialog: false,
        deleteApplication: false
      }
    },
    components: {
      EditApplication,
      SettingApplication,
      countTo
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
      loading () {
        return this.$store.getters.loading
      },
      joinURL () {
        return window.location.origin + '/join/application/' + this.application.share_token
      },
      usersCount () {
        return this.$store.getters.loadedUsers(this.slug).length
      },
      teamsCount () {
        return this.$store.getters.loadedTeams(this.slug).length
      },
      submissionsCount () {
        return this.$store.getters.loadedAllSubmissions(this.slug).length
      },
      formsCount () {
        return this.$store.getters.loadedForms(this.slug).length
      }
    },
    methods: {
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onDeleteApplication () {
        this.$store.dispatch('deleteApplication', {
          slug: this.slug
        })
        this.$router.push('/applications')
      },
      onList (type) {
        this.$router.push('/' + this.slug + '/' + type)
      },
      getPropertyCount (type) {
        switch (type) {
          case 'users': return this.usersCount
          case 'teams': return this.teamsCount
          case 'forms': return this.formsCount
          case 'submissions': return this.submissionsCount
          default: return 0
        }
      }
    },
    created () {
      this.$store.dispatch('loadUsers', this.slug)
      this.$store.dispatch('loadTeams', this.slug)
      this.$store.dispatch('loadForms', this.slug)
      this.$store.dispatch('loadAllSubmissions', this.slug)
      this.$store.dispatch('loadApplicationEmail', this.slug)
    }
  }
</script>


<style scoped>
  .pointer {
    cursor: pointer;
  }

  .wrap-text {
    overflow-wrap: break-word;
  }
</style>