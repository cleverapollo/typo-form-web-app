<template>
  <v-container>
    <v-layout row wrap v-if="loading">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular
          indeterminate
          class="primary--text"
          :width="7"
          :size="70"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <v-card v-if="application">
          <v-card-title>
            <v-spacer></v-spacer>
            <v-menu offset-y bottom left v-if="userIsApplicationAdmin">
              <v-btn icon slot="activator">
                <v-icon>more_vert</v-icon>
              </v-btn>

              <v-list>
                <v-list-tile @click="">
                  <v-list-tile-title>
                    <SettingApplication :application="application" class="my-1"></SettingApplication>
                  </v-list-tile-title>
                </v-list-tile>

                <v-list-tile @click="">
                  <v-list-tile-title>
                    <EditApplication :application="application" class="my-1"></EditApplication>
                  </v-list-tile-title>
                </v-list-tile>

                <v-list-tile @click="onDeleteApplication">
                  <v-list-tile-title>Delete Application</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-card-text>
            <h3 class="break-all pb-4" v-if="userIsApplicationAdmin">{{joinURL}}</h3>
            <v-btn
              flat
              style="height: 70px"
              @click="onList(item.type)"
              v-for="item in items"
              v-if="!item.admin || userIsApplicationAdmin"
              :key="item.title">
              <v-layout column wrap>
                <v-flex>
                  <v-icon
                    x-large>
                    {{item.icon}}
                  </v-icon>
                </v-flex>
                <v-flex>{{item.title}}</v-flex>
              </v-layout>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import EditApplication from './EditApplication'
  import SettingApplication from './SettingApplication'
  export default {
    props: ['slug'],
    data () {
      return {
        api_url: process.env.API_ORIGIN_URL,
        items: [
          { title: 'Users', type: 'users', icon: 'person', admin: true },
          { title: 'Teams', type: 'teams', icon: 'people', admin: false },
          { title: 'Forms', type: 'forms', icon: 'content_paste', admin: true },
          { title: 'Submissions', type: 'submissions', icon: 'assignment', admin: false }
        ]
      }
    },
    components: {
      EditApplication,
      SettingApplication
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      application () {
        return this.$store.getters.loadedApplication(this.slug)
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsApplicationAdmin () {
        return this.application && this.application.application_role_id <= 2
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated || !this.application) {
          return false
        }
        return this.getRole(this.application.application_role_id) === 'Admin'
      },
      loading () {
        return this.$store.getters.loading
      },
      joinURL () {
        return window.origin + '/join/application/' + this.application.share_token
      }
    },
    methods: {
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onDeleteApplication () {
        this.$store.dispatch('deleteApplication', {
          slug: this.slug
        })
        this.$router.push('/applications')
      },
      onList (type) {
        this.$router.push('/' + this.slug + '/' + type)
      }
    },
    created () {
      this.$store.dispatch('loadForms', this.slug)
      this.$store.dispatch('loadApplicationEmail', this.slug)
    }
  }
</script>
