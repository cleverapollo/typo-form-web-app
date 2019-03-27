<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>

        <!-- //Title -->
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Dashboard</h1>
          <v-spacer></v-spacer>
          <div class="text-xs-right py-2" v-if="this.$_isApplicationAdminUser()">
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
import ApplicationMixin from '../../mixins/ApplicationMixin.js'

export default {
  name: 'Dashboard',
  mixins: [ApplicationMixin],
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
  methods: {
    getDashboard () {
      switch (this.$_slug) {
        case 'vline': return 'vline'
        // case 'contoso': return 'vline'
        default: return null
      }
    }
  }
}
</script>
