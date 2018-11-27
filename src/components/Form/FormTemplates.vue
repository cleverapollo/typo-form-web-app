<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>

        <!-- //Title -->
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Form Template</h1>
        </v-flex>
        <v-flex d-flex xs12>
          <p>Select an existing form template below or <a href="#" @click.stop="createFormTemplate = true">create a new form template</a>.</p>
        </v-flex>

        <!-- //Form template List -->
        <v-flex d-flex xs12 v-if="formTemplates.length">
          <v-card>
            <v-list one-line>
              <template v-for="(item, index) in formTemplates">
                <v-list-tile :to="onLoadFormTemplate(item.id)" :key="item.id" avatar>
                  <v-list-tile-avatar color="primary">
                    <span class="white--text headline">{{ getFirstLetter(item.name) }}</span>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title class="black--text">{{ item.name }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider v-if="index < formTemplates.length -1"></v-divider>
              </template>

            </v-list>
          </v-card>
        </v-flex>

        <!-- //No Form Templates -->
        <v-flex xs12 pa-2 v-else>
          <v-alert value="true" type="info">
            It looks like you don't have access to any form template yet.
          </v-alert>
        </v-flex>

      </v-layout>
    </v-flex>

    <!-- //Create Form Template -->
    <v-tooltip top>
      <v-btn slot="activator" fixed dark bottom right fab router class="error" @click.stop="createFormTemplate = true" v-if="userIsApplicationAdmin">
        <v-icon>add</v-icon>
      </v-btn>
      <span>Create Form Template</span>
    </v-tooltip>

    <CreateFormTemplate :slug="slug" :visible="createFormTemplate" v-if="userIsApplicationAdmin" @close="createFormTemplate = false"></CreateFormTemplate>
  </v-layout>
</template>

<script>
  import * as _ from 'lodash'
  import CreateFormTemplate from './CreateFormTemplate'
  export default {
    data () {
      return {
        createFormTemplate: false,
        slug: window.location.hostname.split('.')[0]
      }
    },
    components: {
      CreateFormTemplate
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
      },
      formTemplates () {
        return _.sortBy(this.$store.getters.loadedFormTemplates(this.slug), element => {
          return element.name.toLowerCase()
        })
      }
    },
    methods: {
      getFirstLetter (word) {
        return word.length > 0 ? word.trim().substring(0, 1).toUpperCase() : ''
      },
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onLoadFormTemplate (id) {
        return '/form-builder/' + id
      }
    },
    created: function () {
      this.$store.dispatch('loadUsers', this.slug)
      this.$store.dispatch('loadOrganisations', this.slug)
      this.$store.dispatch('loadFormTemplates', this.slug)
      this.$store.dispatch('loadAllForms', this.slug)
      this.$store.dispatch('loadAllOrganisationUsers', this.slug)
    }
  }
</script>
