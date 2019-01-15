<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>

        <!-- //Title -->
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Dashboard</h1>
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
      </v-layout>
    </v-flex>

    <v-flex>
      <CustomSlot type="dashboardHeader" :mode="editMode" />
    </v-flex>

    <v-container fluid grid-list-lg class="dashboard-container">

      <!-- Welcome Widget -->
      <v-layout row justify-space-around>
        <v-flex xs12>
          <v-card>
            <v-card-text class="primary">
              <div class="title font-weight-regular white--text">{{ getGreeting(this.user.first_name )}}</div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12 md4>
                  <span class="body-2">Role: </span>
                  <span>{{ getUserApplicationRole() }}</span>
                </v-flex>
                <v-flex xs12 md4 text-md-center>
                  <span class="body-2">Email: </span>
                  <span>{{ this.user.email }}</span>
                </v-flex>
                <v-flex xs12 md4 text-md-right>
                  <span class="body-2">Joined: </span>
                  <span>{{ getUserApplicationJoined(this.user.id) }}</span>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <!-- Summary Widgets -->
      <v-layout row wrap justify-space-between>
        <v-flex
          pointer
          @click="onList(item.type)"
          v-for="item in items"
          v-if="!item.admin || userIsApplicationAdmin"
          :key="item.title"
          xs12 sm12 md6>
          <v-card :color="item.color">
            <v-container fluid grid-list-lg>
              <v-layout row>
                <v-flex>
                  <v-icon size="65" >{{ item.icon }}</v-icon>
                </v-flex>
                <v-flex text-xs-right class="white--text">
                  <div class="display-2" color="white">
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
      <v-layout row wrap justify-space-between v-if="userIsApplicationAdmin">

        <!-- // New Users -->
        <v-flex xs12 lg4>
          <v-card
            to="/users"
            height="100%"
            class="widget-scroll"
            >
            <v-card-title class="green">
              <div class="title font-weight-regular white--text">New Users</div>
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
        <v-flex xs12 lg4>
          <v-card
            to="/users"
            height="100%"
            class="widget-scroll"
            >
            <v-card-title class="green">
              <div class="title font-weight-regular white--text">Invited Users</div>
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
        <v-flex xs12 lg4>
          <v-card
            to="/users"
            height="100%"
            class="widget-scroll"
            >
            <v-card-title class="green">
              <div class="title font-weight-regular white--text">User Activity</div>
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

      <!-- // Charts -->
      <v-layout row wrap justify-space-between v-if="userIsApplicationAdmin">

        <!-- // Forms -->
        <v-flex xs12 lg6>
          <v-card>
            <v-card-title class="red">
              <div class="title font-weight-regular white--text">Forms Trendline</div>
            </v-card-title>
            <v-card-text>
              <v-layout row>
                <v-flex xs12>
                  <LineChart :chart-data="formChartData" :options="chartOptions('Forms')" />
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <VDateRange :options="dateRangeOptions" :range="formRange" @input="onFormDateRangeChange"></VDateRange>
            </v-card-actions>
          </v-card>
        </v-flex>

        <!-- // Users -->
        <v-flex xs12 lg6>
          <v-card>
            <v-card-title class="green">
              <div class="title font-weight-regular white--text">Users Trendline</div>
            </v-card-title>
            <v-card-text>
              <v-layout row>
                <v-flex xs12>
                  <LineChart :chart-data="userChartData" :options="chartOptions('Users')" />
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <VDateRange :options="dateRangeOptions" :range="userRange" @input="onUserDateRangeChange"></VDateRange>
            </v-card-actions>
          </v-card>
        </v-flex>

      </v-layout>

      <v-layout v-if="userIsApplicationAdmin" justify-space-between row wrap>
       <!-- // Export Application Data -->
        <v-flex xs12 md6>
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
        <v-flex xs12 md6>
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

    <v-flex>
      <CustomSlot type="dashboardFooter" :mode="editMode" />
    </v-flex>

  </v-layout>

</template>

<script>
  import countTo from 'vue-count-to'
  import moment from 'moment'
  import * as _ from 'lodash'
  import { format, subDays } from 'date-fns'
  import CustomSlot from '../Layout/CustomSlot'
  import LineChart from '../Chart/LineChart'
  import UserMixin from '../Layout/UserMixin'

  export default {
    data () {
      return {
        items: [
          { title: 'Forms', type: 'forms', icon: 'assignment', color: 'blue', admin: false },
          { title: 'Form Templates', type: 'form-templates', icon: 'content_paste', color: 'red', admin: true },
          { title: 'Users', type: 'users', icon: 'person', color: 'green', admin: true },
          { title: 'Organisations', type: 'organisations', icon: 'people', color: 'orange', admin: false }
        ],
        countToStart: 0,
        countToDuration: 3000,
        joinUrlDialog: false,
        slug: window.location.hostname.split('.')[0],
        loadingExport: false,
        userRange: [
          format(subDays(new Date(), 30), 'YYYY-MM-DD'),
          format(subDays(new Date(), 1), 'YYYY-MM-DD')
        ],
        formRange: [
          format(subDays(new Date(), 30), 'YYYY-MM-DD'),
          format(subDays(new Date(), 1), 'YYYY-MM-DD')
        ],
        dateRangeOptions: {
          format: 'YYYY-MM-DD',
          presets: [
            {
              label: 'Last 7 Days',
              range: [
                format(subDays(new Date(), 7), 'YYYY-MM-DD'),
                format(subDays(new Date(), 1), 'YYYY-MM-DD')
              ]
            },
            {
              label: 'Last 14 Days',
              range: [
                format(subDays(new Date(), 14), 'YYYY-MM-DD'),
                format(subDays(new Date(), 1), 'YYYY-MM-DD')
              ]
            },
            {
              label: 'Last 30 Days',
              range: [
                format(subDays(new Date(), 30), 'YYYY-MM-DD'),
                format(subDays(new Date(), 1), 'YYYY-MM-DD')
              ]
            }
          ]
        },
        editMode: false
      }
    },
    mixins: [UserMixin],
    components: {
      countTo,
      CustomSlot,
      LineChart
    },
    computed: {
      userChartData () {
        const labels = []
        const userInvited = []
        const userCreated = []
        let date = moment(this.userRange[0])
        while (date <= moment(this.userRange[1])) {
          labels.push(date.format('YYYY-MM-DD'))
          userInvited.push(0)
          userCreated.push(0)
          date = date.add(1, 'days')
        }

        const newUsers = this.$store.getters.loadedUsers(this.slug).filter((user) => {
          return moment(user.created_at.date).isSameOrAfter(moment(this.userRange[0]), 'days')
        })
        _.forEach(newUsers, user => {
          const diff = moment(user.created_at.date).diff(moment(this.userRange[0]), 'days')
          userCreated[diff] ++
        })

        const invitedUsers = this.$store.getters.invitedUsers(this.slug).filter((user) => {
          return moment(user.created_at.date).isSameOrAfter(moment(this.userRange[0]), 'days')
        })
        _.forEach(invitedUsers, user => {
          const diff = moment(user.created_at.date).diff(moment(this.userRange[0]), 'days')
          userInvited[diff] ++
        })

        return {
          labels: labels,
          datasets: [
            {
              label: 'Invited',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: '#ff6384',
              data: userInvited,
              fill: false,
              pointRadius: 0
            },
            {
              label: 'Created',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: '#36a2eb',
              data: userCreated,
              fill: false,
              pointRadius: 0
            }
          ]
        }
      },

      formChartData () {
        const labels = []
        const formCreated = []
        const formModified = []
        const formSubmitted = []
        let date = moment(this.formRange[0])
        while (date <= moment(this.formRange[1])) {
          labels.push(date.format('YYYY-MM-DD'))
          formCreated.push(0)
          formModified.push(0)
          formSubmitted.push(0)
          date = date.add(1, 'days')
        }

        let forms = this.$store.getters.loadedAllForms(this.slug).filter((form) => {
          return moment(form.created_at.date).isSameOrAfter(moment(this.formRange[0]), 'days')
        })
        _.forEach(forms, form => {
          const diff = moment(form.created_at.date).diff(moment(this.formRange[0]), 'days')
          formCreated[diff] ++
        })

        forms = this.$store.getters.loadedAllForms(this.slug).filter((form) => {
          return moment(form.updated_at.date).isSameOrAfter(moment(this.formRange[0]), 'days')
        })
        _.forEach(forms, form => {
          const diff = moment(form.updated_at.date).diff(moment(this.formRange[0]), 'days')
          formModified[diff] ++
        })

        forms = this.$store.getters.loadedAllForms(this.slug).filter((form) => {
          return form.submitted_date && moment(form.submitted_date).isSameOrAfter(moment(this.formRange[0]), 'days')
        })
        _.forEach(forms, form => {
          const diff = moment(form.submitted_date).diff(moment(this.formRange[0]), 'days')
          formSubmitted[diff] ++
        })

        return {
          labels: labels,
          datasets: [
            {
              label: 'Created',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: '#ff6384',
              data: formCreated,
              fill: false,
              pointRadius: 0
            },
            {
              label: 'Modified',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: '#36a2eb',
              data: formModified,
              fill: false,
              pointRadius: 0
            },
            {
              label: 'Submitted',
              backgroundColor: 'rgba(255, 206, 86, 0.5)',
              borderColor: '#ffce56',
              data: formSubmitted,
              fill: false,
              pointRadius: 0
            }
          ]
        }
      },
      application () {
        return this.$store.getters.loadedApplication(this.slug)
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
      chartOptions (title) {
        return {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'day'
              },
              scaleLabel: {
                display: false,
                labelString: 'Date'
              }
            }],
            yAxes: [{
              ticks: {
                precision: 0
              },
              scaleLabel: {
                display: false,
                labelString: 'Value'
              }
            }]
          },
          title: {
            display: false,
            text: title,
            fontSize: 16
          }
        }
      },
      onUserDateRangeChange (range) {
        this.userRange = range
      },
      onFormDateRangeChange (range) {
        this.formRange = range
      },
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
      onList (type) {
        this.$router.push('/' + type)
      },
      getPropertyCount (type) {
        switch (type) {
          case 'users': return this.usersCount
          case 'organisations': return this.organisationsCount
          case 'form-templates': return this.formTemplatesCount
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
  .dashboard-container {
    padding: 0px;
  }
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
