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
      <v-flex xs9>
        <v-card>
          <v-toolbar color="cyan" dark>
            <v-toolbar-title>View</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-card>
      </v-flex>
      <v-flex xs3>
        <v-card>
          <v-toolbar color="cyan" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>List</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list two-line>
            <template v-for="item in items">
              <v-subheader v-if="item.header" v-text="item.header"></v-subheader>
              <v-divider v-else-if="item.divider" v-bind:inset="item.inset"></v-divider>
              <v-list-tile avatar v-else v-bind:key="item.title" @click="">
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.title"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
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
  import sections from '../Section/Sections.vue'

  export default {
    props: ['application_id', 'id'],
    components: {
      sections
    },
    data () {
      return {
        items: [
          { header: 'Today' },
          { title: 'Brunch this weekend?', subtitle: "<span class='grey--text text--darken-2'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" },
          { divider: true, inset: true },
          { title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>', subtitle: "<span class='grey--text text--darken-2'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend." },
          { divider: true, inset: true },
          { title: 'Oui oui', subtitle: "<span class='grey--text text--darken-2'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?" }
        ]
      }
    },
    computed: {
      application () {
        return this.$store.getters.loadedApplication(parseInt(this.application_id))
      },
      list: {
        get () {
          return this.$store.getters.loadedChildren(this.id, null)
        },
        set (value) {
          const updateObj = {
            id: -1,
            value: value
          }
          this.$store.dispatch('updateSection', updateObj)
        }
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated || !this.application) {
          return false
        }
        return this.application.role === 'Admin' || this.application.role === 'Super Admin'
      },
      form () {
        return this.$store.getters.loadedForm(parseInt(this.application_id), parseInt(this.id))
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    watch: {
      userIsAdmin (value) {
        if (value) {
          this.$router.push('/applications/' + this.application_id + '/forms/show/' + this.id)
        }
      }
    },
    created: function () {
      this.$store.dispatch('loadForms', this.application_id)
      this.$store.dispatch('loadSections', this.id)
    }
  }
</script>
