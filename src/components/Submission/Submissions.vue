<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs9>
        <show-submission :application_id="application_id" :form_id="form_id" :submission_id="submission_id"
                         :form_type="1"></show-submission>
      </v-flex>
      <v-flex xs3>
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>List</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list>
            <template v-for="(submission, index) in submissions">
              <v-list-tile @click="onSubmission(submission.id)">
                <v-list-tile-content>
                  <v-list-tile-title
                    v-html="getSubmissionName(submission)"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider v-if="index + 1 < submissions.length"></v-divider>
            </template>
          </v-list>
        </v-card>
        <v-card v-if="!userIsAdmin">
          <create-submission :application_id="application_id" :form_id="form_id"></create-submission>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import showSubmission from './ShowSubmission.vue'
  import createSubmission from './CreateSubmission.vue'

  export default {
    props: ['application_id', 'form_id'],
    components: {
      showSubmission,
      createSubmission
    },
    data () {
      return {
        submission_id: 1,
        form_type: 1
      }
    },
    computed: {
      submissions () {
        return this.$store.getters.loadedSubmissions(parseInt(this.form_id))
      },
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
        this.submission_id = id
      },
      getSubmissionName (submission) {
        if (submission.team == null) {
          return submission.user.first_name + ' ' + submission.user.last_name
        } else {
          alert(1)
          return submission.team.name
        }
      }
    },
    created () {
      this.$store.dispatch('loadSubmissions', this.form_id)
    },
    watch: {
      userIsAdmin (value) {
        if (value) {
          this.form_type = 2
        }
      }
    }
  }
</script>
