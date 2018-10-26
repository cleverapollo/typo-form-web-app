<template>
  <v-layout row wrap v-if='submission'>
    <v-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">{{ submission.form.name }}</h1>
        </v-flex>

        <v-flex xs12 class="mb-3">
          <v-alert
            :value="status != 'Open'"
            type="success">
            This submission is {{ status.toLowerCase() }}.
          </v-alert>
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

                        <v-list-tile @click.stop="duplicateSubmission">
                          <v-list-tile-avatar>
                            <v-icon>content_copy</v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>Duplicate Submission</v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile @click.stop="onOpenSubmission" v-if="status==='Closed' && userIsApplicationAdmin">
                          <v-list-tile-avatar>
                            <v-icon>assignment</v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>Open Submission</v-list-tile-content>
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
            <v-card-actions v-if="status!=='Closed'">

              <v-layout row wrap>
                <v-flex xs12 v-if="sections.length > 1">
                  <formNavigation
                    :slug="slug"
                    :formId="formId"
                    :submissionId="submissionId"
                  ></formNavigation>
                </v-flex>

                <v-flex xs12 md4 offset-md4 class="mt-4">
                  <v-btn block color="success" @click=onSendSubmission :disabled="!sendAble">
                    Submit
                  </v-btn>
                </v-flex>
                <v-flex xs12 text-xs-center class="mt-3">
                  <p class="caption">This form can only be submitted once all mandatory questions have been answered.</p>
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

    <!-- //Show Completed -->
    <CompletedSubmission :snackbar="submitted" :content="content" @dismissed="submitted = false"></CompletedSubmission>

    <!-- //Show Help Modal -->
    <HelpModal :visible="helpModal && help" :content="help" @close="helpModal = false"></HelpModal>

  </v-layout>
</template>

<script>
  import * as _ from 'lodash'
  import moment from 'moment'
  import FormView from '../FormView'
  import EditSubmission from './EditSubmission'
  import FormNavigation from '../FormNavigation'
  import CompletedSubmission from './CompletedSubmission'
  import HelpModal from './HelpModal'
  import TriggerMixin from '../TriggerMixin.js'

  export default {
    name: 'ShowSubmission',
    props: ['id'],
    mixins: [TriggerMixin],
    data () {
      return {
        deleteSubmission: false,
        snackbar: false,
        slug: window.location.hostname.split('.')[0],
        submitted: false,
        helpModal: false
      }
    },
    components: {
      FormView,
      EditSubmission,
      CompletedSubmission,
      FormNavigation,
      HelpModal
    },
    computed: {
      application () {
        return this.$store.getters.loadedApplication(this.slug)
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsApplicationAdmin () {
        return this.userIsAdmin || this.isSuperUser
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated || !this.application) {
          return false
        }
        return this.getRole(this.application.application_role_id) === 'Admin'
      },
      isSuperUser () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return this.getRole(this.$store.getters.user.role_id) === 'Super Admin'
      },
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
      roles () {
        return this.$store.getters.roles
      },
      periodStart () {
        return this.submission.period_start ? this.submission.period_start.substring(0, 10) : ''
      },
      periodEnd () {
        return this.submission.period_end ? this.submission.period_end.substring(0, 10) : ''
      },
      progressNumber () {
        return this.status === 'Open' ? this.progress(parseInt(this.formId), this.submissionId) : 100
      },
      status () {
        const status = this.statuses.find((status) => {
          return status.id === this.submission.status_id
        })
        return status ? status.status : 'undefined'
      },
      sendAble () {
        if (new Date(this.periodStart).getTime() - new Date().getTime() > 0 || new Date(this.periodEnd).getTime() - new Date().getTime() < 0) {
          return false
        }

        if (this.form.allow_submit === 0) {
          return false
        }

        if (this.status !== 'Open') {
          return false
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
      },
      meta () {
        if (!this.form || !this.form.metas.length) {
          return null
        }
        return JSON.parse(this.form.metas[0].metadata)
      },
      content () {
        if (this.meta && this.meta.content) {
          return this.meta.content
        }
        return '<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">' +
          '<circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>' +
          '<path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>' +
          '</svg>'
      },
      help () {
        if (this.meta && this.meta.help) {
          return this.meta.help
        }
        return null
      }
    },
    methods: {
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      duplicateSubmission: function () {
        this.$store.dispatch('duplicateSubmission', {
          formId: this.formId,
          id: this.submission.id
        })
      },
      onOpenSubmission: function () {
        const statusIndex = _.findIndex(this.statuses, status => {
          return status.status === 'Open'
        })

        this.$store.dispatch('updateSubmission',
          {
            formId: this.formId,
            id: this.submissionId,
            statusId: this.statuses[statusIndex].id
          }
        )
      },
      onDeleteSubmission: function () {
        this.$store.dispatch('deleteSubmission',
          {
            formId: this.formId,
            id: this.submissionId
          }
        )
          .then(() => {
            this.$router.push('/submissions')
          })
      },
      onSendSubmission: function () {
        const statusIndex = _.findIndex(this.statuses, status => {
          return status.status === 'Closed'
        })

        this.$store.dispatch('updateSubmission', {
          formId: this.formId,
          id: this.submissionId,
          statusId: this.statuses[statusIndex].id
        })
          .then((response) => {
            this.submitted = true
            scroll(0, 0)
          })
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
          this.helpModal = true
        })
      this.$store.dispatch('selectSection', null)
    }
  }
</script>
