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
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <router-link to="/" tag="span" style="cursor: pointer">{{ title }}</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="userIsAuthenticated">
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
      menuItems: [
        {icon: 'face', title: 'Sign up', link: '/signup'},
        {icon: 'lock_open', title: 'Sign in', link: '/signin'}
      ]
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
      return this.$route.params['applicationName'] || 'Informed 365'
    }
  },
  watch: {
    user (value) {
      if (value !== null && value !== undefined) {
        this.menuItems = [
          {icon: 'account_circle', title: 'My account', link: '/profile'},
          {icon: 'apps', title: 'Applications', link: '/applications'}
        ]
        this.$store.dispatch('loadQuestionTypes')
        this.$store.dispatch('loadValidationTypes')
        this.$store.dispatch('loadPeriods')
        this.$store.dispatch('loadStatuses')
      } else {
        this.menuItems = [
          {icon: 'face', title: 'Sign up', link: '/signup'},
          {icon: 'lock_open', title: 'Sign in', link: '/signin'}
        ]
      }
    }
  },
  methods: {
    onLogout () {
      this.$store.dispatch('logout')
      this.$router.push('/signin')
    }
  },
  mounted () {
    this.$store.dispatch('loadRoles')
  },
  name: 'App'
}
</script>

<style>
  .break-all {
    word-break: break-all;
  }
</style>
