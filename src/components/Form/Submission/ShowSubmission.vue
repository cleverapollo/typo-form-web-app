<template>
  <v-layout row wrap v-if='submission'>
    <v-flex d-flex sm12 md10 offset-md1 xl8 offset-xl2>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <div class="subheading py-2 px-3">{{ submissionName }}</div>
          <v-menu offset-y bottom left>
            <v-btn icon slot="activator">
              <v-icon>more_vert</v-icon>
            </v-btn>

            <v-list>
              <v-list-tile @click=onDeleteSubmission>
                <v-list-tile-title>Delete Submission</v-list-tile-title>
              </v-list-tile>

              <v-list-tile @click=onSendSubmission v-if="sendAble">
                <v-list-tile-title>Send Submission</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-flex>
        <v-flex xs12>
          <div class="subheading py-2 px-3 break-all">{{periodStart}} ~ {{periodEnd}}</div>
          <v-progress-circular
            xs4
            :size="120"
            :width="15"
            :rotate="-90"
            :value="progress"
            color="primary"
          >
            {{ progress.toFixed(2) }}
          </v-progress-circular>
        </v-flex>
        <v-flex d-flex xs12>
          <form-view
            :slug="slug"
            :formId="formId"
            :submissionId="submissionId"
          ></form-view>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import * as _ from 'lodash'
  import FormView from '../FormView'

  export default {
    props: ['slug', 'formId', 'submissionId'],
    components: {
      FormView
    },
    computed: {
      submission () {
        return this.$store.getters.loadedSubmission(this.formId, this.submissionId)
      },
      statuses () {
        return this.$store.getters.statuses
      },
      periodStart () {
        return this.submission.period_start ? this.submission.period_start.substring(0, 10) : ''
      },
      periodEnd () {
        return this.submission.period_end ? this.submission.period_end.substring(0, 10) : ''
      },
      sendAble () {
        if (new Date(this.periodStart).getTime() - new Date().getTime() > 0 || new Date(this.periodEnd).getTime() - new Date().getTime() < 0) {
          return false
        }

        if (this.statuses) {
          const statusIndex = _.findIndex(this.statuses, status => {
            return status.id === this.submission.status_id
          })
          if (statusIndex > -1 && this.statuses[statusIndex].status !== 'Open') {
            return false
          }
        }

        return (this.progress === 100)
      },
      submissionName () {
        if (this.submission.team == null) {
          return this.submission.user.first_name + ' ' + this.submission.user.last_name
        } else {
          return this.submission.team.name
        }
      },
      progress () {
        const sections = this.$store.getters.loadedSections(this.formId)
        let questionCount = 0
        let responseCount = 0
        sections.forEach(function (section) {
          let questions = this.$store.getters.loadedQuestions(this.formId, section.id).filter(question => question.mandatory)
          questionCount += questions.length
          questions.forEach(function (question) {
            let responses = this.$store.getters.loadedResponses(this.formId, this.submissionId).filter(response => response.question_id === question.id)
            responseCount += responses.length ? 1 : 0
          }, this)
        }, this)

        return questionCount !== 0 ? responseCount * 100 / questionCount : 0
      }
    },
    methods: {
      onDeleteSubmission: function () {
        this.$store.dispatch('deleteSubmission',
          {
            formId: this.formId,
            id: this.submissionId
          }
        )
      },
      onSendSubmission: function () {
        const statusIndex = _.findIndex(this.statuses, status => {
          return status.status === 'Closed'
        })

        this.$store.dispatch('updateSubmission',
          {
            formId: this.formId,
            id: this.submissionId,
            statusId: this.statuses[statusIndex].id
          }
        )
      }
    }
  }
</script>
