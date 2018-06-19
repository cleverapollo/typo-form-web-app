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
                :to="applicationURL(item.path)"
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
              :to="rootURL(item.path)"
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
              :to="rootURL(item.path)"
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
      color="info"
      dark
      app
      fixed
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="ml-0 pl-3">
        <router-link :to="titleLink" tag="span" style="cursor: pointer">
          <div class="d-flex flex-row">
            <v-avatar tile v-if="titleIcon">
              <img :src="titleIcon"/>
            </v-avatar>
            <div class="pl-3 application-name">{{title}}</div>
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
                :to="'/'+ application.slug">
                <v-list-tile-content>
                  <div class="d-flex flex-row">
                    <div class="application-icon" v-if='application.icon'>
                      <img :src="application.icon"/>
                    </div>
                    <div class="pl-3">{{application.name}}</div>
                  </div>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-menu>

        <!-- //Not yet enabled
        <v-btn icon>
          <v-icon>notifications</v-icon>
        </v-btn>
        -->
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
              <v-list-tile-content>
                Edit Account
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              @click="onLogout">
              <v-list-tile-content>Sign out</v-list-tile-content>
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
    data () {
      return {
        drawer: null,
        api_url: process.env.API_ORIGIN_URL,
        app_name: process.env.APP_NAME
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
      userIsAuthenticated () {
        return this.user !== null && this.user !== undefined
      },
      title () {
        const application = this.$store.getters.loadedApplication(this.$route.params['slug'])
        return application ? application.name : process.env.APP_NAME
      },
      titleIcon () {
        const application = this.$store.getters.loadedApplication(this.$route.params['slug'])
        return application && application.icon ? application.icon : ''
      },
      titleLink () {
        if (this.$route.params['slug']) {
          return '/' + this.$route.params['slug']
        }
        return '/'
      },
      applications () {
        return this.$store.getters.loadedApplications
      },
      application () {
        return this.$store.getters.loadedApplication(this.$route.params['slug'])
      },
      applicationItems () {
        return [
            { title: 'Dashboard', path: '', icon: 'dashboard', admin: false },
            { title: 'Users', path: 'users', icon: 'person', admin: true },
            { title: 'Teams', path: 'teams', icon: 'people', admin: false },
            { title: 'Forms', path: 'forms', icon: 'content_paste', admin: true },
            { title: 'Submissions', path: 'submissions', icon: 'assignment', admin: false }
            // ,{ title: 'Settings', path: 'settings', icon: 'settings', admin: true }
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
      userIsApplicationAdmin () {
        return this.application && this.application.application_role_id <= 2
      },
      copyright () {
        return new Date().getFullYear() + ' ' + process.env.APP_NAME
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
        this.$store.dispatch('loadApplications')
      }
    },
    methods: {
      onLogout () {
        this.$store.dispatch('logout')
        this.$router.push('/login')
      },
      applicationURL (path) {
        return '/' + this.application.slug + '/' + path
      },
      rootURL (path) {
        return '/' + path
      }
    },
    name: 'App'
  }
</script>

<style>
  .application-name {
    line-height:46px;
  }

  .border-top {
    border-top:1px solid #e0e0e0;
  }

  .border-bottom {
    border-bottom:1px solid #e0e0e0;
  }
</style>
