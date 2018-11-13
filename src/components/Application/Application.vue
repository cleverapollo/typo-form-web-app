<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>

        <!-- //Title -->
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Dashboard</h1>
          <v-spacer></v-spacer>

          <!--
          <div class="text-xs-right">
            <v-dialog v-model="joinUrlDialog" persistent max-width="600">
              <v-btn slot="activator" icon v-if="userIsApplicationAdmin">
                <v-icon>share</v-icon>
              </v-btn>
              <v-card>
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
          </div>
          -->

        </v-flex>
      </v-layout>
    </v-flex>

    <v-container fluid grid-list-lg>

      <!-- Welcome Widget -->
      <v-layout row justify-space-around>
        <v-flex xs12>
          <v-card>
            <v-card-text>
              <div class="title font-weight-regular">{{ getGreeting(this.user.first_name )}}</div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs4>
                  <span class="body-2">Role: </span>
                  <span>{{ getUserApplicationRole() }}</span>
                </v-flex>
                <v-flex xs4 text-xs-center>
                  <span class="body-2">Email: </span>
                  <span>{{ this.user.email }}</span>
                </v-flex>
                <v-flex xs4 text-xs-right>
                  <span class="body-2">Joined: </span>
                  <span>{{ getUserApplicationJoined(this.user.id) }}</span>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <!-- Summary Widgets -->
      <v-layout row justify-space-between>
        <v-flex
          pointer
          @click="onList(item.type)"
          v-for="item in items"
          v-if="!item.admin || userIsApplicationAdmin"
          :key="item.title"
          xs12>
          <v-card>
            <v-container fluid grid-list-lg>
              <v-layout row>
                <v-flex xs3>
                  <v-icon size="65" :color="item.color">{{ item.icon }}</v-icon>
                </v-flex>
                <v-flex xs9 text-xs-right>
                  <div class="display-2">
                    <countTo :startVal="countToStart" :endVal="getPropertyCount(item.type)" :duration="countToDuration"></countTo>
                  </div>
                  <div class="body-1">{{ item.title }}</div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>

      <!-- // New Users Widget -->
      <v-layout row justify-space-between v-if="userIsApplicationAdmin">

        <!-- // New Users -->
        <v-flex xs4>
          <v-card
            to="/users"
            height="100%"
            class="widget-scroll"
            >
            <v-card-title>
              <div class="title font-weight-regular">New Users</div>
            </v-card-title>
            <v-list two-line v-if="getNewUsers.length">
              <template v-for="(item, index) in getNewUsers">
                <v-list-tile 
                  :key="index"
                  avatar>
                  <v-list-tile-avatar>
                    <v-icon size="48" color="primary">account_circle</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.first_name + ' ' + item.last_name }}</v-list-tile-title>
                    <v-list-tile-sub-title>{{ item.email }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <div class="body-1 pt-3">Joined</div>
                    <v-list-tile-action-text>{{ getTimeSince(item.created_at.date) }}</v-list-tile-action-text>
                  </v-list-tile-action>
                </v-list-tile>
                <v-divider 
                  v-if="index + 1 < getNewUsers.length"
                ></v-divider>
              </template>
            </v-list>
            <v-card-text v-else>
              <div class="text-xs-center">
                <v-icon size="60" class="pa-1">person_add</v-icon>
                <p class="body-1">No results, why don't you <router-link to="/users" tag="a">invite a user</router-link>?</p>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>

        <!-- // Invited Users -->
        <v-flex xs4>
          <v-card
            to="/users"
            height="100%"
            class="widget-scroll"
            >
            <v-card-title>
              <div class="title font-weight-regular">Invited Users</div>
            </v-card-title>
            <v-list two-line v-if="getInvitedUsers.length">
              <template v-for="(item, index) in getInvitedUsers">
                <v-list-tile 
                  :key="index"
                  avatar>
                  <v-list-tile-avatar>
                    <v-icon size="48" color="primary">account_circle</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.invitee }}</v-list-tile-title>
                    <v-list-tile-sub-title>Invited by {{ getUserName(item.inviter_id) }} as a {{ getRole(item.application_role_id) }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <div class="body-1 pt-3">Invited</div>
                    <v-list-tile-action-text>{{ getTimeSince(item.created_at.date) }}</v-list-tile-action-text>
                  </v-list-tile-action>
                </v-list-tile>
                <v-divider 
                  v-if="index + 1 < getInvitedUsers.length"
                ></v-divider>
              </template>
            </v-list>
            <v-card-text v-else>
              <div class="text-xs-center">
                <v-icon size="60" class="pa-1">person_add</v-icon>
                <p class="body-1">No results, why don't you <router-link to="/users" tag="a">invite a user</router-link>?</p>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>

        <!-- // User Activity -->
        <v-flex xs4>
          <v-card
            to="/users"
            height="100%"
            class="widget-scroll"
            >
            <v-card-title>
              <div class="title font-weight-regular">User Activity</div>
            </v-card-title>
            <v-list two-line v-if="getActiveUsers.length">
              <template v-for="(item, index) in getActiveUsers">
                <v-list-tile 
                  :key="index"
                  avatar>
                  <v-list-tile-avatar>
                    <v-icon size="48" color="primary">account_circle</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.first_name + ' ' + item.last_name }}</v-list-tile-title>
                    <v-list-tile-sub-title>{{ item.email }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <div class="body-1 pt-3">Last Active</div>
                    <v-list-tile-action-text>{{ getTimeSince(item.updated_at.date) }}</v-list-tile-action-text>
                  </v-list-tile-action>
                </v-list-tile>
                <v-divider 
                  v-if="index + 1 < getActiveUsers.length"
                ></v-divider>
              </template>
            </v-list>
            <v-card-text v-else>
              <div class="text-xs-center">
                <v-icon size="60" class="pa-1">inbox</v-icon>
                <p class="body-1">No results</p>
              </div>
            </v-card-text>
          </v-card>
        </v-flex>

      </v-layout>

      <v-layout v-if="userIsApplicationAdmin" justify-space-between row>
       <!-- // Export Application Data -->
        <v-flex xs6>
          <v-btn
            color="primary"
            outline
            block
            large
            @click.native="getApplicationDataExport()"
            :disabled="loadingExport"
            :loading="loadingExport">
            Export Application Data
            <v-icon right dark>save_alt</v-icon>
          </v-btn>
        </v-flex>

        <!-- // Report Builder -->
        <v-flex xs6>
          <v-btn
            color="primary"
            outline
            block
            large
            to="/report"
          >
            Report Builder
            <v-icon right dark>description</v-icon>
          </v-btn>
        </v-flex>

      </v-layout>

    </v-container>

  </v-layout>

</template>

<script>
  import countTo from 'vue-count-to'
  import moment from 'moment'
  import * as _ from 'lodash'

  export default {
    data () {
      return {
        items: [
          { title: 'Forms', type: 'forms', icon: 'assignment', color: 'blue', admin: false },
          { title: 'Form Templates', type: 'formTemplates', icon: 'content_paste', color: 'orange', admin: true },
          { title: 'Users', type: 'users', icon: 'person', color: 'red', admin: true },
          { title: 'Organisations', type: 'organisations', icon: 'people', color: 'green', admin: false }
        ],
        countToStart: 0,
        countToDuration: 3000,
        joinUrlDialog: false,
        slug: window.location.hostname.split('.')[0],
        loadingExport: false
      }
    },
    components: {
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
        if (!this.application) {
          return ''
        }
        return window.location.origin + '/join/application/' + this.application.share_token
      },
      usersCount () {
        return this.$store.getters.loadedUsers(this.slug).length
      },
      organisationsCount () {
        return this.$store.getters.loadedOrganisations(this.slug).length
      },
      formsCount () {
        return this.$store.getters.loadedAllForms(this.slug).length
      },
      formTemplatesCount () {
        return this.$store.getters.loadedFormTemplates(this.slug).length
      },
      getNewUsers () {
        // Last 90 Days
        let numberOfDays = 90
        let newUsers = this.$store.getters.loadedUsers(this.slug).filter((user) => {
          return moment(user.created_at.date).isSameOrAfter(moment().subtract(numberOfDays, 'd'), 'days')
        })
        // Sort by date DESC
        return _.sortBy(newUsers, (user) => {
          return user.created_at.date
        }).reverse()
      },
      getInvitedUsers () {
        // Sort by date ASC
        let invitedUsers = this.$store.getters.invitedUsers(this.slug)
        return _.sortBy(invitedUsers, user => {
          return user.created_at.date
        })
      },
      getActiveUsers () {
        let newUsers = this.$store.getters.loadedUsers(this.slug)
        // Sort by date DESC
        return _.sortBy(newUsers, (user) => {
          return user.updated_at.date
        }).reverse()
      },
      user () {
        return this.$store.getters.user
      }
    },
    methods: {
      getApplicationDataExport () {
        this.loadingExport = true
        window.axios.get(process.env.API_URL + 'application/' + this.slug + '/export')
        .then(response => {
          if (response.data.file.url) {
            let a = document.createElement('a')
            a.download = response.data.file.name
            a.href = response.data.file.url
            a.click()
          }
        }).catch(error => {
          console.log(error)
        }).then(() => {
          this.loadingExport = false
        })
      },
      getUserApplicationJoined (userId) {
        if (this.userIsAdmin) {
          let user = _.find(this.$store.getters.loadedUsers(this.slug), user => {
            return user.id === userId
          })
          return user ? this.getTimeSince(user.created_at.date) : 'N/A'
        } else {
          return this.user && this.user.created_at ? this.getTimeSince(this.user.created_at.date) : 'N/A'
        }
      },
      getUserApplicationRole () {
        return this.isSuperUser ? 'Super Admin' : this.getRole(this.application.application_role_id)
      },
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onList (type) {
        this.$router.push('/' + type)
      },
      getPropertyCount (type) {
        switch (type) {
          case 'users': return this.usersCount
          case 'organisations': return this.organisationsCount
          case 'formTemplates': return this.formTemplatesCount
          case 'forms': return this.formsCount
          default: return 0
        }
      },
      getTimeSince (time) {
        return moment(time).fromNow()
      },
      getUserName (userId) {
        // Find user by id
        let user = _.find(this.users, user => {
          return user.id === userId
        })
        return user ? user.first_name + ' ' + user.last_name : 'System Administrator'
      },
      getGreeting (name) {
        let today = new Date()
        let curHr = today.getHours()
        let greeting = null

        if (curHr < 12) {
          greeting = 'Good morning'
        } else if (curHr < 18) {
          greeting = 'Good afternoon'
        } else {
          greeting = 'Good evening'
        }

        return greeting + ', ' + name
      }
    },
    created () {
      this.$store.dispatch('loadOrganisations', this.slug)
      this.$store.dispatch('loadFormTemplates', this.slug)
      this.$store.dispatch('loadAllForms', this.slug)
      this.$store.dispatch('loadUsers', this.slug)
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
  .widget-scroll .v-list {
    max-height:250px;
    overflow: auto;
  }
</style>
