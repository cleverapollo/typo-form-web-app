<template>
  <v-container>
    <v-layout row wrap>
      <v-tabs v-model="active">
        <v-tabs-bar class="primary" dark>
          <v-tabs-item
            v-for="tab in tabs"
            :key="tab"
            :href="'#' + tab"
            ripple
          >
            {{ tab }}
          </v-tabs-item>
          <v-tabs-slider color="yellow"></v-tabs-slider>
        </v-tabs-bar>
        <v-tabs-items>
          <v-tabs-content
            :key="tabs[0]"
            :id="tabs[0]"
          >
            <v-card flat>
              <questions :application_id="application_id" :id="id"></questions>
            </v-card>
          </v-tabs-content>
          <v-tabs-content
            :key="tabs[1]"
            :id="tabs[1]"
          >
            <v-card flat>
              <submissions :application_id="application_id" :id="id"></submissions>
            </v-card>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </v-layout>
  </v-container>
</template>

<script>
  import questions from './ShowForm.vue'
  import submissions from '../Submission/ShowSubmission.vue'

  export default {
    props: ['application_id', 'id'],
    components: {
      questions,
      submissions
    },
    data () {
      return {
        tabs: ['Questions', 'Submissions'],
        active: null,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      }
    },
    computed: {
      application () {
        return this.$store.getters.loadedApplication(parseInt(this.application_id))
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsNotAdmin () {
        if (!this.userIsAuthenticated || !this.application) {
          return false
        }
        return this.application.role !== 'Admin' && this.application.role !== 'Super Admin'
      }
    },
    watch: {
      userIsNotAdmin (value) {
        if (value) {
          this.$router.push('/applications/' + this.application_id + '/forms/show/' + this.id + '/submission')
        }
      }
    },
    methods: {},
    created: function () {
      this.$store.dispatch('loadApplications')
    }
  }
</script>
