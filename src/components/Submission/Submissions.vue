<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs9>
        <show-submission :application_id="application_id" :form_id="form_id"></show-submission>
      </v-flex>
      <v-flex xs3>
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>List</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list two-line>
            <template v-for="item in items">
              <v-divider v-if="item.divider" v-bind:inset="item.inset"></v-divider>
              <v-list-tile v-else @click="onSubmission(item.form_id)">
                <v-list-tile-content>
                  <v-list-tile-title
                    v-html="item.title"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import showSubmission from './ShowSubmission.vue'

  export default {
    props: ['application_id'],
    components: {
      showSubmission
    },
    data () {
      return {
        form_id: 1,
        items: [
          {
            id: 1,
            form_id: 1,
            title: 'Brunch this weekend?',
            subtitle: "<span class='grey--text text--darken-2'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
          },
          {id: 2, form_id: 2, divider: true, inset: true},
          {
            id: 3,
            form_id: 3,
            title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
            subtitle: "<span class='grey--text text--darken-2'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
          },
          {id: 4, form_id: 4, divider: true, inset: true},
          {
            id: 5,
            form_id: 5,
            title: 'Oui oui',
            subtitle: "<span class='grey--text text--darken-2'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
          }
        ]
      }
    },
    computed: {
      application () {
        return this.$store.getters.loadedApplication(parseInt(this.application_id))
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated || !this.application) {
          return false
        }
        return this.application.role === 'Admin' || this.application.role === 'Super Admin'
      }
    },
    methods: {
      onSubmission (id) {
        this.form_id = id
      }
    }
  }
</script>
