<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Teams</h1>
        </v-flex>
        <v-flex d-flex xs12>
          <p>Select an existing team below or <a href="#" @click.stop="createTeam = true">create a new team</a>.</p>
        </v-flex>


        <v-flex d-flex xs12 v-if="teams.length">
          <v-card>
            <v-list one-line>

              <!-- //Team List -->
              <template v-for="(item, index) in teams">
                <v-list-tile :to="onLoadTeam(item.id)" :key="item.id" avatar>
                  <v-list-tile-avatar color="primary">
                    <span class="white--text headline">{{ getFirstLetter(item.name) }}</span>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title class="black--text">{{ item.name }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider v-if="index < teams.length -1"></v-divider>
              </template>
            </v-list>
          </v-card>
        </v-flex>

        <!-- //No Teams -->
        <v-flex xs12 pa-2 v-else>
          <v-alert value="true" type="info">
             It looks like you don't have access to any teams yet.
          </v-alert>
        </v-flex>

      </v-layout>
    </v-flex>

    <v-tooltip top>
      <v-btn slot="activator" fixed dark bottom right fab router class="error" @click.stop="createTeam = true">
        <v-icon>add</v-icon>
      </v-btn>
      <span>Create Team</span>
    </v-tooltip>

    <!-- //Create Team -->
    <CreateTeam :visible="createTeam" :slug="slug" @close="createTeam = false"></CreateTeam>

  </v-layout>
</template>


<script>
  import * as _ from 'lodash'
  import CreateTeam from './CreateTeam'
  export default {
    data () {
      return {
        createTeam: false,
        slug: window.location.hostname.split('.')[0]
      }
    },
    components: {
      CreateTeam
    },
    computed: {
      teams () {
        return _.sortBy(this.$store.getters.loadedTeams(this.slug), element => {
          return element.name.toLowerCase()
        })
      }
    },
    methods: {
      getFirstLetter (word) {
        return word.length > 0 ? word.trim().substring(0, 1).toUpperCase() : ''
      },
      onLoadTeam (id) {
        return '/teams/' + id
      }
    },
    created: function () {
      this.$store.dispatch('loadTeams', this.slug)
    }
  }
</script>
