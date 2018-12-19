<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Organisations</h1>
        </v-flex>
        <v-flex d-flex xs12>
          <p>Select an existing organisation below or <a href="#" @click.stop="createOrganisation = true">create a new organisation</a>.</p>
        </v-flex>

        <v-flex>
          <CustomSlot type="organisationsHeader" />
        </v-flex>


        <v-flex d-flex xs12 v-if="organisations.length">
          <v-card>
            <v-list one-line>

              <!-- //Organisation List -->
              <template v-for="(item, index) in organisations">
                <v-list-tile :to="onLoadOrganisation(item.id)" :key="item.id" avatar>
                  <v-list-tile-avatar color="primary">
                    <span class="white--text headline">{{ getFirstLetter(item.name) }}</span>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title class="black--text">{{ item.name }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider v-if="index < organisations.length -1"></v-divider>
              </template>
            </v-list>
          </v-card>
        </v-flex>

        <!-- //No Organisations -->
        <v-flex xs12 pa-2 v-else>
          <v-alert value="true" type="info">
             It looks like you don't have access to any organisations yet.
          </v-alert>
        </v-flex>

        <v-flex>
          <CustomSlot type="organisationsFooter" />
        </v-flex>

      </v-layout>
    </v-flex>

    <v-tooltip top>
      <v-btn slot="activator" fixed dark bottom right fab router class="error" @click.stop="createOrganisation = true">
        <v-icon>add</v-icon>
      </v-btn>
      <span>Create Organisation</span>
    </v-tooltip>

    <!-- //Create Organisation -->
    <CreateOrganisation :visible="createOrganisation" :slug="slug" @close="createOrganisation = false"></CreateOrganisation>

  </v-layout>
</template>


<script>
  import * as _ from 'lodash'
  import CreateOrganisation from './CreateOrganisation'
  import CustomSlot from '../Layout/CustomSlot'
  export default {
    data () {
      return {
        createOrganisation: false,
        slug: window.location.hostname.split('.')[0]
      }
    },
    components: {
      CreateOrganisation,
      CustomSlot
    },
    computed: {
      organisations () {
        return _.sortBy(this.$store.getters.loadedOrganisations(this.slug), element => {
          return element.name.toLowerCase()
        })
      }
    },
    methods: {
      getFirstLetter (word) {
        return word.length > 0 ? word.trim().substring(0, 1).toUpperCase() : ''
      },
      onLoadOrganisation (id) {
        return '/organisations/' + id
      }
    },
    created: function () {
      this.$store.dispatch('loadOrganisations', this.slug)
    }
  }
</script>
