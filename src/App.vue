<template>
  <v-app>

    <!-- //Application Loading -->
    <!-- // TODO: Set loader for pages, not updates -->
    <!-- <ApplicationLoading /> -->

    <!-- //Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
      temporary
      v-if="!backgroundRequired"
    >

      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar tile>
              <img src="/static/icon.png" >
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ app_name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <!-- //Authenticated User -->
      <template v-if="user">

        <!-- //Application Items -->
        <template v-if="application">
          <v-divider></v-divider>
          <v-list dense>
            <template
              v-for="item in applicationItems"
              v-if="!item.admin || isAdmin"
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
              v-if="item.application || !item.application && !application"
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
      v-if="!backgroundRequired"
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
      <template v-if="user">
        <v-menu offset-y left class="hidden-sm-and-down" v-if='applications.length > 1'>
          <v-btn
            icon
            slot="activator">
            <v-avatar size="32px" tile>
              <v-icon>apps</v-icon>
            </v-avatar>
          </v-btn>
          <v-list>
            <template v-for="(application, index) in sortedApplications" :v-bind="application.id">
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
    <v-content>
      <v-container :fill-height="backgroundRequired" fluid :class="{'px-0': $vuetify.breakpoint.xsOnly }">
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
        app_name: process.env.APP_NAME,
        app_domain: process.env.APP_DOMAIN,
        ssl_enabled: process.env.SSL_ENABLED
      }
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      user () {
        return this.$store.getters.user
      },
      slug () {
        return window.location.hostname.split('.')[0]
      },
      applications () {
        return this.$store.getters.loadedApplications
      },
      application () {
        return this.$store.getters.loadedApplication(this.slug)
      },
      backgroundRequired () {
        return !this.$route.meta.requiresAuth
      },
      applicationItems () {
        return [
            { title: 'Dashboard', path: 'dashboard', icon: 'dashboard', admin: false },
            { title: 'Users', path: 'users', icon: 'person', admin: true },
            { title: 'Organisations', path: 'organisations', icon: 'people', admin: false },
            { title: 'Form Builder', path: 'forms', icon: 'content_paste', admin: true },
            { title: 'Forms', path: 'submissions', icon: 'assignment', admin: false },
            { title: 'Settings', path: 'settings', icon: 'settings', admin: true }
        ]
      },
      accountItems () {
        return [
            { title: 'Applications', path: 'applications', icon: 'apps', application: false },
            { title: 'My Profile', path: 'profile', icon: 'account_circle', application: true }
        ]
      },
      isAdmin () {
        return this.isSuperUser || (this.user && this.application && this.getRole(this.application.application_role_id) === 'Admin')
      },
      isSuperUser () {
        return this.user && this.getRole(this.user.role_id) === 'Super Admin'
      },
      appProtocol () {
        return this.ssl_enabled === 'true' ? 'https://' : 'http://'
      },
      sortedApplications () {
        return this.applications.slice().sort(function (a, b) { return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0) })
      }
    },
    methods: {
      applicationName (application = []) {
        return application && application.name ? application.name : this.app_name
      },
      applicationUrl (application = []) {
        return this.appProtocol + application.slug + '.' + this.app_domain
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
      if (this.user) {
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
  body {
    background: no-repeat center center fixed; 
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    background-color: #F4F4F4;
  }
  .theme--light.application {
    background: transparent !important;
  }
  .application .v-navigation-drawer--is-mobile, 
  .application .v-navigation-drawer--temporary {
    z-index: 30;
  }
  .application .app-toolbar {
    z-index: 25;
  }
  .application-name {
    line-height:48px;
  }
  .app-toolbar {
    border-bottom: solid thin rgba(0,0,0,.12) !important;
  }

  .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #7ac142;
    fill: none;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }

  .checkmark {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #fff;
    stroke-miterlimit: 10;
    margin: 10% auto;
    box-shadow: inset 0 0 0 #7ac142;
    animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
  }

  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  }

  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }
  @keyframes scale {
    0%,
    100% {
      transform: none;
    }
    50% {
      transform: scale3d(1.1, 1.1, 1);
    }
  }
  @keyframes fill {
    100% {
      box-shadow: inset 0 0 0 30px #7ac142;
    }
  }
</style>
