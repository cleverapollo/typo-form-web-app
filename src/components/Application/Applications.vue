<template>
  <v-layout row wrap py-3>
    <v-flex d-flex sm12 md10 offset-md1 xl8 offset-xl2>
      <v-card class="elevation-2">
        <v-card-title class="info">
          <div class="title mb-2 mt-2 white--text">Applications</div>
        </v-card-title>
        <v-list one-line>
          <template v-if="applications.length">

            <!-- //Application List -->
            <template v-for="(item, index) in sortedApplications(applications)">
              <v-layout row wrap>
                <v-flex xs8>
                  <v-list-tile avatar>
                    <v-list-tile-avatar tile v-if="item.icon">
                      <img :src="api_url + 'uploads/' + item.icon">
                    </v-list-tile-avatar>
                    <v-list-tile-avatar color="teal" v-else>
                      <span class="white--black headline">{{ getFirstLetter(item.name) }}</span>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="item.name" class="black--text"></v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-flex>
                <v-flex xs4 class="text-xs-right">
                  <v-btn color="pink accent-2 white--text my-3" :to="applicationUrl(item.slug)">Select</v-btn>
                </v-flex>
              </v-layout>
              <v-divider v-if="index != applications.length -1"></v-divider>
            </template>
          </template>

          <!-- //No Applications -->
          <template v-else>
            <div class="text-xs-center">No applications available.</div>
          </template>
        </v-list>
      </v-card>
    </v-flex>

    <!-- //Action Button -->
    <v-btn fixed dark bottom right fab router class="red elevation-5" @click.stop="createApplication = true" v-if="isSuperUser">
      <v-icon>add</v-icon>
    </v-btn>

    <!-- //Create Application -->
    <CreateApplication :visible="createApplication" @close="createApplication = false"></CreateApplication>
  </v-layout>
</template>

<script>
  import CreateApplication from './CreateApplication'
  export default {
    data () {
      return {
        createApplication: false,
        api_url: process.env.API_ORIGIN_URL
      }
    },
    components: {
      CreateApplication
    },
    computed: {
      applications () {
        return this.$store.getters.loadedApplications
      },
      isSuperUser () {
        return this.$store.getters.user && this.$store.getters.user.role_id === 1
      }
    },
    methods: {
      getFirstLetter (word) {
        return word.length > 0 ? word.trim().substring(0, 1).toUpperCase() : ''
      },
      applicationUrl (slug) {
        return '/' + slug
      },
      sortedApplications (applications) {
        return applications.slice().sort(function (a, b) { return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0) })
      }
    }
  }
</script>