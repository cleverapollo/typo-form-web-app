<template>
  <v-app>
    <v-navigation-drawer v-model="sideNav" fixed app temporary>
      <v-list>
        <v-list-tile
          v-if="userIsAuthenticated"
          :to="'/profile'">
          <v-list-tile-action>
            <v-icon>account_circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            My Account
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="userIsAuthenticated"
          @click="onLogout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Sign out</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark class="primary" dense app>
      <v-toolbar-side-icon
        @click.stop="sideNav = !sideNav"
      ></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">{{ title }}</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          flat
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-menu offset-y left v-if="userIsAuthenticated">
          <v-btn dark flat icon slot="activator">
            <v-icon>account_circle</v-icon>
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
      </v-toolbar-items>
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
      sideNav: false,
      title: 'Informed 365'
    }
  },
  computed: {
    menuItems () {
      let menuItems = [
        {icon: 'face', title: 'Sign up', link: '/signup'},
        {icon: 'lock_open', title: 'Sign in', link: '/signin'}
      ]
      if (this.userIsAuthenticated) {
        menuItems = [
          {icon: 'group', title: 'Teams', link: '/teams'}
        ]
      }
      return menuItems
    },
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    }
  },
  methods: {
    onLogout () {
      this.$store.dispatch('logout')
    }
  },
  name: 'App'
}
</script>


