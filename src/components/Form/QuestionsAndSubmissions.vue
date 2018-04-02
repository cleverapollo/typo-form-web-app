<template>
  <v-container>
    <v-layout row wrap>
      <v-tabs v-model="active">
        <v-tabs-bar class="primary" dark>
          <v-tabs-item
            v-for="(tab, index) in tabs"
            v-if="userIsAdmin || index != 0"
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
            v-for="(tab, index) in tabs"
            v-if="userIsAdmin || index != 0"
            :key="tab"
            :id="tab"
          >
            <v-card v-if="index == 0" flat>
              <questions :application_id="application_id" :id="id" :submission_id="1"></questions>
            </v-card>
            <v-card v-else flat>
              <submissions :application_id="application_id" :form_id="id"></submissions>
            </v-card>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </v-layout>
  </v-container>
</template>

<script>
  import questions from './ShowForm.vue'
  import submissions from '../Submission/Submissions.vue'

  export default {
    props: ['application_id', 'id'],
    components: {
      questions,
      submissions
    },
    data () {
      return {
        tabs: ['Questions', 'Submissions'],
        active: null
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
        return this.application.applictaion_role === 'Admin' || this.application.application_role === 'Super Admin'
      }
    },
    methods: {},
    created: function () {
      this.$store.dispatch('loadApplications')
    }
  }
</script>
