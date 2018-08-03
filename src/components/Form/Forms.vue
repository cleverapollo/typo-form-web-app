<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>

        <!-- //Title -->
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Forms</h1>
        </v-flex>

        <!-- //Form List -->
        <v-flex d-flex xs12 v-if="forms.length">
          <v-card>
            <v-list one-line>
              <template v-for="(item, index) in forms">
                <v-list-tile :to="onLoadForm(item.id)" :key="item.id" avatar>
                  <v-list-tile-avatar color="primary">
                    <span class="white--text headline">{{ getFirstLetter(item.name) }}</span>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title class="black--text">{{ item.name }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider v-if="index < forms.length -1"></v-divider>
              </template>

            </v-list>
          </v-card>
        </v-flex>

        <!-- //No Forms -->
        <v-flex xs12 pa-2 v-else>
          <v-alert value="true" type="info">
            It looks like you don't have access to any forms yet.
          </v-alert>
        </v-flex>

      </v-layout>
    </v-flex>

    <!-- //Create Form -->
    <v-tooltip top>
      <v-btn slot="activator" fixed dark bottom right fab router class="error" @click.stop="createForm = true" v-if="userIsApplicationAdmin">
        <v-icon>add</v-icon>
      </v-btn>
      <span>Create Form</span>
    </v-tooltip>

    <CreateForm :slug="slug" :visible="createForm" v-if="userIsApplicationAdmin" @close="createForm = false"></CreateForm>
  </v-layout>
</template>

<script>
  import * as _ from 'lodash'
  import CreateForm from './CreateForm'
  export default {
    props: ['slug'],
    data () {
      return {
        createForm: false
      }
    },
    components: {
      CreateForm
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
      forms () {
        return _.sortBy(this.$store.getters.loadedForms(this.slug), element => {
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
      onLoadForm (id) {
        return '/' + this.slug + '/forms/' + id
      }
    },
    created: function () {
      this.$store.dispatch('loadForms', this.slug)
    }
  }
</script>
