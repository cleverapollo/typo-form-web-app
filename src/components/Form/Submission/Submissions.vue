<template>
  <v-layout row wrap pa-1>
    <v-flex xs9 d-flex>
      <show-submission :applicationName="applicationName" :formId="formId" :submissionId="submissionId"></show-submission>
    </v-flex>

    <v-flex xs3 d-flex>
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Submission List</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <v-layout row wrap>
            <template v-for="(submission, index) in submissions">
              <v-flex xs12>
                <v-card color="blue-grey darken-2" class="white--text" @click="onSubmission(submission.id)">
                  <v-card-title primary-title>
                    <div class="headline">{{getSubmissionName(submission)}}</div>
                    <div>
                      <span>Period Start: {{getPeriodStart(submission)}}</span>
                      <br/>
                      <span>Period End: {{getPeriodEnd(submission)}}</span>
                    </div>
                  </v-card-title>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <edit-submission :submission="submission" :formId="formId" v-if="!userIsAdmin"></edit-submission>
                  </v-card-actions>
                </v-card>
              </v-flex>

              <v-divider v-if="index + 1 < submissions.length"></v-divider>
            </template>
          </v-layout>

          <create-submission style="margin: 0 auto" :applicationName="applicationName" :formId="formId" v-if="!userIsAdmin"></create-submission>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import showSubmission from './ShowSubmission'
  import createSubmission from './CreateSubmission'
  import editSubmission from './EditSubmission'

  export default {
    props: ['applicationName', 'formId'],
    components: {
      showSubmission,
      createSubmission,
      editSubmission
    },
    data () {
      return {
        submissionId: 0
      }
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      submissions () {
        return this.$store.getters.loadedSubmissions(parseInt(this.formId))
      },
      submissionTeams () {
        return this.$store.getters.loadedSubmissionTeams(this.applicationName, parseInt(this.formId))
      },
      application () {
        return this.$store.getters.loadedApplication(this.applicationName)
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
    watch: {
      submissions (value) {
        if (value.length) {
          this.submissionId = value[0].id
        }
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
        this.submissionId = id
      },
      getSubmissionName (submission) {
        if (submission.team == null) {
          return submission.user.first_name + ' ' + submission.user.last_name
        } else {
          alert(1)
          return submission.team.name
        }
      },
      getPeriodStart (submission) {
        return submission.period_start ? submission.period_start.substring(0, 10) : ''
      },
      getPeriodEnd (submission) {
        return submission.period_end ? submission.period_end.substring(0, 10) : ''
      }
    }
  }
</script>
