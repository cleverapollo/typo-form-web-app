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

    <!-- // Custom Dashboards -->
    <VlineDashboard v-if="getDashboard() === 'vline'"></VlineDashboard>
    <DefaultDashboard v-else></DefaultDashboard>

    <v-flex>
      <CustomSlot type="dashboardFooter" :mode="editMode" />
    </v-flex>
  </v-layout>
</template>

<script>
import DefaultDashboard from './DefaultDashboard'
import VlineDashboard from './VlineDashboard'
import CustomSlot from '../Layout/CustomSlot'

export default {
  name: 'Dashboard',
  components: {
    DefaultDashboard,
    VlineDashboard,
    CustomSlot
  },
  data () {
    return {
      editMode: false
    }
  },
  computed: {
    slug () {
      return window.location.hostname.split('.')[0]
    }
  },
  methods: {
    getDashboard () {
      switch (this.slug) {
        case 'vline': return 'vline'
        case 'contoso': return 'vline'
        default: return null
      }
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
  }
}
</script>
