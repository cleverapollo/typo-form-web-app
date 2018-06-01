<template>
  <v-layout row wrap v-if='submission'>
    <v-flex sm12 md10 offset-md1 xl8 offset-xl2>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <div class="subheading py-2 px-3">{{ submissionName }}</div>
          <v-menu offset-y bottom left class="text-xs-right">
            <v-btn icon slot="activator">
              <v-icon>more_vert</v-icon>
            </v-btn>

            <v-list>
              <v-list-tile @click="">
                <v-list-tile-title>
                  <EditSubmission :submission="submission" :formId="formId"></EditSubmission>
                </v-list-tile-title>
              </v-list-tile>

              <v-list-tile @click=onDeleteSubmission>
                <v-list-tile-title>Delete Submission</v-list-tile-title>
              </v-list-tile>

              <v-list-tile @click=onSendSubmission v-if="sendAble">
                <v-list-tile-title>Send Submission</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-flex>
        <v-flex xs6>
          <div class="subheading py-2 px-3 break-all" v-if='periodStart || periodEnd'>{{periodStart}} ~ {{periodEnd}}</div>
        </v-flex>
        <v-flex xs6 class="text-xs-right">
          <v-progress-circular
            xs4
            :size="80"
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
            :submissionId="id"
          ></form-view>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import * as _ from 'lodash'
  import FormView from '../FormView'
  import EditSubmission from './EditSubmission'

  export default {
    props: ['slug', 'id'],
    components: {
      FormView,
      EditSubmission
    },
    computed: {
      submission () {
        return this.$store.getters.loadedApplicationSubmission(this.slug, parseInt(this.id))
      },
      formId () {
        if (!this.submission) {
          return null
        }
        return this.submission.form.id
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
            let responses = this.$store.getters.loadedResponses(this.formId, this.id).filter(response => response.question_id === question.id)
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
            id: this.id
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
            id: this.id,
            statusId: this.statuses[statusIndex].id
          }
        )
      }
    },
    created () {
      this.$store.dispatch('loadForms', this.slug)
      this.$store.dispatch('loadAllSubmissions', this.slug)
        .then(() => {
          this.$store.dispatch('loadSections', this.formId)
          this.$store.dispatch('loadValidations', this.formId)
          this.$store.dispatch('loadTriggers', this.formId)
        })
      this.$store.dispatch('selectSection', null)
    }
  }
</script>
