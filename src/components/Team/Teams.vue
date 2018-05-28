<template>
  <v-layout row wrap>
    <v-flex d-flex sm12 md10 offset-md1 xl8 offset-xl2>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <div class="subheading py-2 px-3">Teams</div>
        </v-flex>
        <v-flex d-flex xs12>
          <v-card>
            <v-list one-line>
              <template v-if="teams.length">

                <!-- //Team List -->
                <template v-for="(item, index) in teams">
                  <v-list-tile :to="onLoadTeam(item.id)" :key="item.id" avatar>
                    <v-list-tile-avatar color="primary">
                      <span class="white--text headline">{{ getFirstLetter(item.name) }}</span>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="item.name" class="black--text"></v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider v-if="index < teams.length -1"></v-divider>
                </template>
              </template>

              <!-- //No Teams -->
              <template v-else>
                <div class="text-xs-center">No teams available.</div>
              </template>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

    <!-- //Create Team -->
    <CreateTeam :slug="slug"></CreateTeam>
  </v-layout>
</template>


<script>
  import * as _ from 'lodash'
  import CreateTeam from './CreateTeam'
  export default {
    props: ['slug'],
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
        return '/' + this.slug + '/teams/' + id
      }
    },
    created: function () {
      this.$store.dispatch('loadTeams', this.slug)
    }
  }
</script>
