<template>
  <v-layout row wrap>
    <v-flex d-flex sm12 md10 offset-md1 xl8 offset-xl2>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <div class="subheading py-2 px-3">Forms</div>
        </v-flex>
        <v-flex d-flex xs12>
          <v-card>
            <v-list one-line>
              <template v-if="forms.length">

                <!-- //Form List -->
                <template v-for="(item, index) in forms">
                  <v-list-tile :to="onLoadForm(item.id)" :key="item.id" avatar>
                    <v-list-tile-avatar color="primary">
                      <span class="white--text headline">{{ getFirstLetter(item.name) }}</span>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="item.name" class="black--text"></v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider v-if="index < forms.length -1"></v-divider>
                </template>
              </template>

              <!-- //No Forms -->
              <template v-else>
                <div class="text-xs-center">No forms available.</div>
              </template>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

    <!-- //Create Form -->
    <v-tooltip top>
      <v-btn slot="activator" fixed dark bottom right fab router class="error" @click.stop="createForm = true">
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
