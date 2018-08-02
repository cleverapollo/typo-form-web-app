<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <div class="subheading py-2 px-3">Applications</div>
        </v-flex>
        <v-flex d-flex xs12 v-if="applications.length">
          <v-card>
            <v-list one-line>

              <!-- //Application List -->
              <template v-for="(item, index) in sortApplications(applications)">
                <v-list-tile :to="applicationUrl(item.slug)" :key="item.id" avatar>
                  <v-list-tile-avatar tile v-if="item.icon">
                    <img :src="item.icon">
                  </v-list-tile-avatar>
                  <v-list-tile-avatar color="primary" v-else>
                    <span class="white--text headline">{{ getFirstLetter(item.name) }}</span>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title class="black--text">{{ item.name }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider v-if="index < applications.length -1"></v-divider>
              </template>
  
            </v-list>
          </v-card>
        </v-flex>

        <!-- //No Applications -->
        <v-flex xs12 pa-2 v-else>
          <v-alert value="true" type="info">
            It looks like you don't have access to any applications yet. Any application that you have been invitied into will display once you accept the invitation.
          </v-alert>
        </v-flex>

      </v-layout>
    </v-flex>

    <!-- //Action Button -->
    <v-tooltip top>
      <v-btn slot="activator" fixed dark bottom right fab router class="error" @click.stop="createApplication = true" v-if="isSuperUser">
        <v-icon>add</v-icon>
      </v-btn>
      <span>Create Application</span>
    </v-tooltip>

    <!-- //Create Application -->
    <CreateApplication :visible="createApplication" @close="createApplication = false"></CreateApplication>
  </v-layout>
</template>

<script>
  import CreateApplication from './CreateApplication'
  export default {
    data () {
      return {
        createApplication: false
      }
    },
    components: {
      CreateApplication
    },
    computed: {
      applications () {
        return this.$store.getters.loadedApplications
      },
      roles () {
        return this.$store.getters.roles
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      isSuperUser () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return this.getRole(this.$store.getters.user.role_id) === 'Super Admin'
      },
      applicationCount () {
        return this.applications.length
      }
    },
    watch: {
      applicationCount (value) {
        this.onValidate(value)
      }
    },
    methods: {
      onValidate (value) {
        if (value === 1 && !this.isSuperUser) {
          this.$router.push('/' + this.applications[0].slug)
        }
      },
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      getFirstLetter (word) {
        return word.length > 0 ? word.trim().substring(0, 1).toUpperCase() : ''
      },
      applicationUrl (slug) {
        return '/' + slug
      },
      sortApplications (applications) {
        return applications.slice().sort(function (a, b) { return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0) })
      }
    },
    mounted () {
      this.onValidate(this.applicationCount)
    }
  }
</script>