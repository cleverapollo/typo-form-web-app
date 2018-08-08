<template>
  <v-layout row wrap v-if='submission'>
    <v-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">{{ submission.form.name }}</h1>
        </v-flex>

        <!-- //Submission Layout -->
        <v-flex xs12>
          <v-card>

            <!-- //Header -->
            <v-card-title class="info white--text">
              <v-layout row wrap>
                <v-flex d-flex xs12>
                  <div class="title pt-3">{{ submissionOwner }}</div>

                  <!-- //Menu -->
                  <div class="text-xs-right">
                    <v-menu offset-y bottom left>
                      <v-btn icon slot="activator">
                        <v-icon class="white--text">more_vert</v-icon>
                      </v-btn>

                      <v-list>
                        <v-list-tile @click="">
                          <v-list-tile-avatar>
                            <v-icon>edit</v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <EditSubmission :slug="slug" :submission="submission" :formId="formId"></EditSubmission>
                          </v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile @click.stop="deleteSubmission = true">
                          <v-list-tile-avatar>
                            <v-icon>delete</v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>Delete Submission</v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </div>
                </v-flex>

              </v-layout>
            </v-card-title>
            
            <!-- // Submission Information -->
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12 sm6>
                  <div class="body pb-3">Last Saved: {{ lastSaved }}</div>
                  <div class="body" v-if='periodStart || periodEnd'>Period: {{ submissionPeriod }}</div>
                </v-flex>

                <!-- //Progress -->
                <v-flex xs12 sm6 text-sm-right>
                  <v-progress-circular
                    color="success"
                    :value="parseInt(progressNumber.toFixed(0))"
                    :size="75"
                    :width="5"
                    :rotate="-90"
                  >
                  <div class="title">{{ progressNumber.toFixed(0) + "%" }}</div>
                  </v-progress-circular>

                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider></v-divider>

            <!-- //Form Content -->
            <v-card-text>
              <v-layout row wrap>

                <v-flex d-flex xs12>
                  <form-view
                    :slug="slug"
                    :formId="formId"
                    :submissionId="submissionId"
                  ></form-view>
                </v-flex>

              </v-layout>
            </v-card-text>

            <!-- //Footer -->
            <v-divider></v-divider>
            <v-card-actions>

              <v-layout row wrap>
                <v-flex xs12 v-if="sections.length > 1">
                  <formNavigation
                    :slug="slug"
                    :formId="formId"
                    :submissionId="submissionId"
                  ></formNavigation>
                </v-flex>

                <v-flex xs12 md4 offset-md4 class="mt-4" v-if="sendAble">
                  <v-btn block color="success" @click=onSendSubmission :disabled="!sendAble">
                    Submit
                  </v-btn>
                </v-flex>
              </v-layout>

            </v-card-actions>

          </v-card>
        </v-flex>

      </v-layout>
    </v-flex>

    <!-- //Delete Submission -->
    <DeleteConfirmDialog @delete-action="onDeleteSubmission" :visible="deleteSubmission" @close="deleteSubmission = false"></DeleteConfirmDialog>

    <!-- //Show snackbar -->
    <Snackbar :snackbar="snackbar" @dismissed="snackbar = false"></Snackbar>

  </v-layout>
</template>

<script>
  import * as _ from 'lodash'
  import moment from 'moment'
  import FormView from '../FormView'
  import EditSubmission from './EditSubmission'
  import FormNavigation from '../FormNavigation'
  import TriggerMixin from '../TriggerMixin.js'

  export default {
    props: ['slug', 'id'],
    mixins: [TriggerMixin],
    data () {
      return {
        deleteSubmission: false,
        snackbar: false
      }
    },
    components: {
      FormView,
      EditSubmission,
      FormNavigation
    },
    computed: {
      sections () {
        return this.$store.getters.loadedSections(this.formId)
      },
      submissionId () {
        return parseInt(this.id)
      },
      submission () {
        return this.$store.getters.loadedApplicationSubmission(this.slug, this.submissionId)
      },
      formId () {
        if (!this.submission) {
          return null
        }
        return this.submission.form.id
      },
      form () {
        return this.$store.getters.loadedForm(this.slug, this.formId)
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
      progressNumber () {
        return this.progress(parseInt(this.formId), this.submissionId)
      },
      sendAble () {
        if (new Date(this.periodStart).getTime() - new Date().getTime() > 0 || new Date(this.periodEnd).getTime() - new Date().getTime() < 0) {
          return false
        }

        if (this.form.allow_submit === 0) {
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

        return this.progressNumber === 100
      },
      submissionOwner () {
        if (this.submission.team == null) {
          return this.submission.user.first_name + ' ' + this.submission.user.last_name
        } else {
          return this.submission.team.name
        }
      },
      submissionPeriod () {
        if (this.periodStart && this.periodEnd) {
          return moment(this.periodStart).format('MMM Do YYYY') + ' - ' + moment(this.periodEnd).format('MMM Do YYYY')
        } else if (this.periodStart || this.periodEnd) {
          return this.periodStart ? moment(this.periodStart).format('MMM Do YYYY') : moment(this.periodEnd).format('MMM Do YYYY')
        } else {
          return null
        }
      },
      lastSaved () {
        return moment(this.submission.updated_at.date).format('MMM Do YYYY h:mm A')
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
          .then(() => {
            this.$router.push('/' + this.slug + '/submissions')
          })
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
    },
    created () {
      this.$store.dispatch('loadUsers', this.slug)
      this.$store.dispatch('loadTeams', this.slug)
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
