<template>
  <v-app>

    <!-- //Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
      temporary
    >

      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar tile>
              <img src="/static/logo.png" >
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ app_name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <!-- //Authenticated User -->
      <template v-if="userIsAuthenticated">

        <!-- //Application Items -->
        <template v-if="application">
          <v-divider></v-divider>
          <v-list dense>
            <template
              v-for="item in applicationItems"
              v-if="!item.admin || userIsApplicationAdmin"
              >
              <v-list-tile
                :to="'/' + item.path"
                :key="item.title"
              >
                <v-list-tile-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ item.title }}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </template>

        <!-- //Account Items -->
        <v-list dense>
          <v-divider></v-divider>
          <template v-for="item in accountItems">
            <v-list-tile
              :to="'/' + item.path"
              :key="item.title"
            >
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.title }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </template>

      <!-- //Auth Menu -->
      <template v-else>
        <v-divider></v-divider>
        <v-list dense>
          <template v-for="item in authItems">
            <v-list-tile
              :tp="'/' + item.path"
              :key="item.title"
            >
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.title }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </template>

    </v-navigation-drawer>

    <!-- //Toolbar -->
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="white"
      class="elevation-0 app-toolbar"
      app
      fixed
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="ml-0 pl-3">
        <router-link to="/" tag="span" style="cursor: pointer">
          <div class="d-flex flex-row">
            <v-avatar tile v-if="applicationIcon(application)">
              <img :src="applicationIcon(application)"/>
            </v-avatar>
            <div class="pl-3 application-name">{{ applicationName(application) }}</div>
          </div>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="userIsAuthenticated">
        <v-menu offset-y left class="hidden-sm-and-down">
          <v-btn
            icon
            slot="activator">
            <v-avatar size="32px" tile>
              <v-icon>apps</v-icon>
            </v-avatar>
          </v-btn>
          <v-list v-if='applications.length'>
            <template v-for="(application, index) in applications" :v-bind="application.id">
              <v-list-tile
                avatar
                ripple
                :key="application.id"
                :href="applicationUrl(application)">
                <v-list-tile-avatar tile v-if="applicationIcon(application)">
                  <img :src="applicationIcon(application)">
                </v-list-tile-avatar>
                <v-list-tile-avatar color="primary" v-else>
                  <span class="white--text headline">{{ applicationFirstLetter(application) }}</span>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <div class="d-flex flex-row">
                    <div class="pl-3">{{ applicationName(application) }}</div>
                  </div>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-menu>

        <v-menu offset-y left>
          <v-btn
            icon
            slot="activator">
            <v-avatar size="32px" tile>
              <v-icon>account_circle</v-icon>
            </v-avatar>
          </v-btn>
          <v-list>
            <v-list-tile
              :to="'/profile'">
              <v-list-tile-avatar>
                <v-icon>account_circle</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                My Profile
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              @click="onLogout">
              <v-list-tile-avatar>
                <v-icon>lock</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                Sign out
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </template>
      <template v-else>
        <v-btn icon :to="'login'">
          <v-icon>account_circle</v-icon>
        </v-btn>
      </template>
    </v-toolbar>
    <v-content class="border-bottom">
      <v-container fluid :class="{'px-0': $vuetify.breakpoint.xsOnly }">
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    name: 'App',
    data () {
      return {
        drawer: null,
        app_name: process.env.APP_NAME
      }
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      user () {
        return this.$store.getters.user
      },
      applications () {
        return this.$store.getters.loadedApplications
      },
      application () {
        const url = window.location.origin.split('://')
        const subdomain = url[1].split('.')
        if (subdomain[0] === 'informed365' || subdomain[0] === 'app') {
          return null
        }
        return this.$store.getters.loadedApplication(subdomain[0])
      },
      applicationItems () {
        return [
            { title: 'Dashboard', path: 'dashboard', icon: 'dashboard', admin: false },
            { title: 'Users', path: 'users', icon: 'person', admin: true },
            { title: 'Teams', path: 'teams', icon: 'people', admin: false },
            { title: 'Forms', path: 'forms', icon: 'content_paste', admin: true },
            { title: 'Submissions', path: 'submissions', icon: 'assignment', admin: false },
            { title: 'Settings', path: 'settings', icon: 'settings', admin: true }
        ]
      },
      accountItems () {
        return [
            { title: 'Applications', path: 'applications', icon: 'apps' },
            { title: 'My Profile', path: 'profile', icon: 'account_circle' }
        ]
      },
      authItems () {
        return [
            { title: 'Log In', path: 'login', icon: 'account_circle' },
            { title: 'Register', path: 'register', icon: 'person_add' }
        ]
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
      }
    },
    methods: {
      applicationName (application = []) {
        return application ? application.name : this.app_name
      },
      applicationUrl (application = []) {
        const url = window.location.origin.split('://')
        const subdomain = url[1].split('.')
        if (application) {
          if (subdomain[0] === 'informed365') {
            subdomain.unshift(application.slug)
          } else {
            subdomain[0] = application.slug
          }
        }
        return url[0] + '://' + subdomain.join('.')
      },
      applicationIcon (application = []) {
        try {
          return JSON.parse(application.icon).url
        } catch (error) {
          return false
        }
      },
      applicationFirstLetter (application = []) {
        return application.name && application.name.length > 0 ? application.name.trim().substring(0, 1).toUpperCase() : 'A'
      },
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onLogout () {
        this.$store.dispatch('logout')
        this.$router.push('/login')
      }
    },
    created () {
      if (this.userIsAuthenticated) {
        this.$store.dispatch('loadQuestionTypes')
        this.$store.dispatch('loadValidationTypes')
        this.$store.dispatch('loadPeriods')
        this.$store.dispatch('loadStatuses')
        this.$store.dispatch('loadRoles')
        this.$store.dispatch('loadComparators')
        this.$store.dispatch('loadTriggerTypes')
        this.$store.dispatch('loadAnswerSorts')
        this.$store.dispatch('loadApplications')
      }
    }
  }
</script>

<style>
  .border-bottom {
    border-bottom:1px solid #e0e0e0;
  }
  .theme--light.application {
    background: #eee;
  }
  .v-toolbar.app-toolbar {
    box-shadow: 1px 2px 1px #d3d3d3 !important;
  }
  .application-name {
    line-height:48px;
  }

</style>
