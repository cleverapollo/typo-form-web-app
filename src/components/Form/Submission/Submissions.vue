<template>
  <v-layout row wrap>
    <v-flex xs9>
      <show-submission :application_id="application_id" :form_id="form_id" :submission_id="submission_id"></show-submission>
    </v-flex>
    <v-flex xs3>
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Submissions</v-toolbar-title>
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
</template>

<script>
  import showSubmission from './ShowSubmission'
  import createSubmission from './CreateSubmission'

  export default {
    props: ['application_id', 'form_id'],
    components: {
      showSubmission,
      createSubmission
    },
    data () {
      return {
        submission_id: 0
      }
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      submissions () {
        return this.$store.getters.loadedSubmissions(parseInt(this.form_id))
      },
      submissionTeams () {
        return this.$store.getters.loadedSubmissionTeams(parseInt(this.application_id), parseInt(this.form_id))
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
        return this.getRole(this.application.role_id) === 'Admin'
      }
    },
    methods: {
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
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
    }
  }
</script>
