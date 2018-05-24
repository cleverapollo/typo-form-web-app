<template>
  <v-layout row wrap>
    <v-flex xs12 md3>
      <v-card class="ma-1">
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Submission List</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <v-layout row wrap>
            <template v-for="(submission, index) in submissions">
              <v-flex xs12 style="margin-bottom: 16px">
                <v-card
                  class="white--text"
                  :class="active(submission.id)"
                  color="blue-grey darken-2"
                  style="cursor: pointer;"
                >
                  <div @click="onSubmission(submission.id)">
                    <v-card-title primary-title class="flex-column">
                      <v-flex xs-12 class="headline">
                        {{getSubmissionName(submission)}}
                      </v-flex>

                      <div>
                        <span>Start: {{getPeriodStart(submission)}}</span>
                        <br/>
                        <span>End  : {{getPeriodEnd(submission)}}</span>
                      </div>
                    </v-card-title>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <edit-submission
                        :submission="submission"
                        :formId="formId"
                        v-if="!isAdmin"
                      ></edit-submission>
                    </v-card-actions>
                  </div>
                </v-card>
              </v-flex>

              <v-divider v-if="index + 1 < submissions.length"></v-divider>
            </template>
          </v-layout>

          <create-submission
            :slug="slug"
            :formId="formId"
            v-if="!isAdmin"
            style="margin: 0 auto"
          ></create-submission>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 md9 v-if="submissionId > 0">
      <show-submission
        :slug="slug"
        :formId="formId"
        :submissionId="submissionId"
        :isAdmin="isAdmin"
        :view="view"
      ></show-submission>

      <v-layout row justify-space-between class="mt-3 mb-3">
        <v-btn
          color="primary"
          @click="prevSubmission"
          :disabled="!prevAble"
        >
          prev
        </v-btn>
        <v-btn
          color="primary"
          @click="nextSubmission"
          :disabled="!nextAble"
        >
          next
        </v-btn>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import * as _ from 'lodash'
  import ShowSubmission from './ShowSubmission'
  import CreateSubmission from './CreateSubmission'
  import EditSubmission from './EditSubmission'

  export default {
    props: ['slug', 'formId', 'isAdmin', 'view'],
    components: {
      ShowSubmission,
      CreateSubmission,
      EditSubmission
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
        return this.$store.getters.loadedSubmissionTeams(this.slug, parseInt(this.formId))
      },
      nextAble () {
        if (this.submissions) {
          const submissionIndex = _.findIndex(this.submissions, submission => {
            return submission.id === this.submissionId
          })
          if (submissionIndex >= 0 && this.submissions.length > submissionIndex + 1) {
            return true
          }
        }
        return false
      },
      prevAble () {
        if (this.submissions) {
          const submissionIndex = _.findIndex(this.submissions, submission => {
            return submission.id === this.submissionId
          })
          if (submissionIndex > 0) {
            return true
          }
        }
        return false
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
          return submission.team.name
        }
      },
      getPeriodStart (submission) {
        return submission.period_start ? submission.period_start.substring(0, 10) : ''
      },
      getPeriodEnd (submission) {
        return submission.period_end ? submission.period_end.substring(0, 10) : ''
      },
      active (submissionId) {
        return (this.submissionId === submissionId) ? 'active' : ''
      },
      prevSubmission () {
        if (this.submissions) {
          const submissionIndex = _.findIndex(this.submissions, submission => {
            return submission.id === this.submissionId
          })
          this.submissionId = this.submissions[submissionIndex - 1].id
        }
      },
      nextSubmission () {
        if (this.submissions) {
          const submissionIndex = _.findIndex(this.submissions, submission => {
            return submission.id === this.submissionId
          })
          this.submissionId = this.submissions[submissionIndex + 1].id
        }
      }
    }
  }
</script>

<style scoped>
  .active {
    background-color: #1976D2 !important;
  }
</style>
