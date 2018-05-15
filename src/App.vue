<template>
  <v-app>
    <v-navigation-drawer
      fixed
      app
      v-model="drawer"
      disable-route-watcher
      temporary
      hide-overlay
    >
      <v-list dense>
        <template v-for="item in menuItems">
          <v-list-tile
            :to="item.link"
            :key="item.title"
            @click='drawer = false'
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
    </v-navigation-drawer>
    <v-toolbar
      color="primary"
      dark
      app
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      fixed
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="ml-0 pl-3">
        <router-link :to="titleLink" tag="span" style="cursor: pointer">
          <div class="d-flex flex-row">
            <div class="application-icon align-self-center" v-if='titleIcon'>
              <img :src="titleIcon"/>
            </div>
            <div class="pl-3">{{title}}</div>
          </div>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="userIsAuthenticated">
        <v-menu offset-y left>
          <v-btn
            icon
            slot="activator">
            <v-avatar size="32px" tile>
              <v-icon>apps</v-icon>
            </v-avatar>
          </v-btn>
          <v-list v-if='applications.length'>
            <template v-for="(application, index) in applications">
              <v-list-tile
                avatar
                ripple
                :key="application.id"
                :to="'/'+application.slug">
                <v-list-tile-content>
                  <div class="d-flex flex-row">
                    <div class="application-icon" v-if='application.icon'>
                      <img :src="api_url + 'uploads/' + application.icon"/>
                    </div>
                    <div class="pl-3">{{application.name}}</div>
                  </div>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-menu>
        <v-btn icon>
          <v-icon>notifications</v-icon>
        </v-btn>
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
    </v-toolbar>
    <v-content>
      <v-container fluid>
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
        api_url: process.env.API_ORIGIN_URL
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
        return application ? application.name : 'Informed 365'
      },
      titleIcon () {
        const application = this.$store.getters.loadedApplication(this.$route.params['slug'])
        return application && application.icon ? this.api_url + 'uploads/' + application.icon : ''
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
      menuItems () {
        if (this.userIsAuthenticated) {
          return [
            {icon: 'account_circle', title: 'My account', link: '/profile'},
            {icon: 'apps', title: 'Applications', link: '/applications'}
          ]
        } else {
          return [
            {icon: 'face', title: 'Sign up', link: '/signup'},
            {icon: 'lock_open', title: 'Sign in', link: '/signin'}
          ]
        }
      }
    },
    created () {
      if (this.userIsAuthenticated) {
        this.$store.dispatch('loadQuestionTypes')
        this.$store.dispatch('loadValidationTypes')
        this.$store.dispatch('loadPeriods')
        this.$store.dispatch('loadStatuses')
        this.$store.dispatch('loadRoles')
        this.$store.dispatch('loadApplications')
      }
    },
    methods: {
      onLogout () {
        this.$store.dispatch('logout')
        this.$router.push('/signin')
      }
    },
    name: 'App'
  }
</script>

<style>
  .break-all {
    word-break: break-all;
  }

  .application-icon {
    width: 30px;
    margin: auto;
  }

  .application-icon img {
    width: 100%;
    vertical-align: middle;
  }

  .icon-preview {
    width: 100%;
  }
</style>
