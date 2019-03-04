<template>
  <v-layout row wrap v-if='form'>
    <v-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">{{ form.form_template.name }}</h1>
        </v-flex>

        <v-flex>
          <CustomSlot :type="'formTemplateHeader' + formTemplateId" :mode="false" />
        </v-flex>

        <!-- //Form Layout -->
        <v-flex xs12>
          <v-card>

            <!-- //Header -->
            <v-card-title class="info white--text">
              <v-layout row wrap>
                <v-flex d-flex xs12>
                  <div class="title pt-3">{{ formOwner }}</div>

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
                            <EditForm :slug="slug" :form="form" :formTemplateId="formTemplateId"></EditForm>
                          </v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile @click.stop="deleteForm = true">
                          <v-list-tile-avatar>
                            <v-icon>delete</v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>Delete Form</v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile @click.stop="duplicateForm">
                          <v-list-tile-avatar>
                            <v-icon>content_copy</v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>Duplicate Form</v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile @click.stop="onOpenForm" v-if="status==='Closed' && isAdmin">
                          <v-list-tile-avatar>
                            <v-icon>assignment</v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>Open Form</v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                    <v-btn
                      flat
                      icon
                      color="info"
                      v-if="help"
                      @click="helpModal = true"
                    >
                      <v-icon class="white--text">help</v-icon>
                    </v-btn>
                  </div>
                </v-flex>

              </v-layout>
            </v-card-title>

            <!-- // Form Information -->
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12 sm6>
                  <div class="body pb-3">Last Saved: {{ lastSaved }}</div>
                  <div class="body" v-if='periodStart || periodEnd'>Period: {{ formPeriod }}</div>
                </v-flex>

                <!-- //Progress -->
                <v-flex xs12 sm6 text-sm-right v-if="formTemplate.show_progress">
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

            <!-- //Form Template Content -->
            <v-card-text>
              <v-layout row wrap>

                <v-flex d-flex xs12>
                  <form-view
                    :slug="slug"
                    :formTemplateId="formTemplateId"
                    :formId="formId"
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
                    :formTemplateId="formTemplateId"
                    :formId="formId"
                  ></formNavigation>
                </v-flex>

                <template v-if="submittable">
                  <v-flex xs12 md4 offset-md4 class="my-3" v-if="sendAble">
                    <v-btn block color="success" @click=onSendForm :disabled="!sendAble">
                      Submit
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 text-xs-center class="my-3" v-else>
                    <p class="caption">This form can only be submitted once all mandatory questions have been answered.</p>
                  </v-flex>
                </template>
              </v-layout>

            </v-card-actions>

          </v-card>
        </v-flex>

        <v-flex>
          <CustomSlot :type="'formTemplateFooter' + formTemplateId" :mode="false" />
        </v-flex>

      </v-layout>
    </v-flex>

    <!-- //Delete Form -->
    <DeleteConfirmDialog @delete-action="onDeleteForm" :visible="deleteForm" @close="deleteForm = false"></DeleteConfirmDialog>

    <!-- //Show snackbar -->
    <Snackbar content="Progress saved" :snackbar="snackbar" @dismissed="snackbar = false"></Snackbar>

    <!-- //Show Completed -->
    <CompletedForm :snackbar="submitted" :content="content" @dismissed="submitted = false"></CompletedForm>

    <!-- //Show Help Modal -->
    <HelpModal :visible="helpModal && help" :content="help" @close="helpModal = false"></HelpModal>

    <!-- //Duplicate formTemplate -->
    <DuplicateForm :visible="duplicated" :content="duplicatedContent" @close="duplicated = false"></DuplicateForm>

  </v-layout>
</template>

<script>
  import * as _ from 'lodash'
  import moment from 'moment'
  import FormView from '../FormView'
  import EditForm from './EditForm'
  import FormNavigation from '../FormNavigation'
  import CompletedForm from './CompletedForm'
  import HelpModal from './HelpModal'
  import DuplicateForm from './DuplicateForm'
  import TriggerMixin from '../TriggerMixin.js'
  import CustomSlot from '../../Layout/CustomSlot'

  export default {
    name: 'ShowForm',
    props: ['id'],
    mixins: [TriggerMixin],
    data () {
      return {
        deleteForm: false,
        snackbar: false,
        slug: window.location.hostname.split('.')[0],
        submitted: false,
        helpModal: false,
        duplicated: false,
        duplicatedContent: ''
      }
    },
    components: {
      FormView,
      EditForm,
      CompletedForm,
      FormNavigation,
      HelpModal,
      DuplicateForm,
      CustomSlot
    },
    computed: {
      application () {
        return this.$store.getters.loadedApplication(this.slug)
      },
      sections () {
        return this.$store.getters.loadedSections(this.formTemplateId)
      },
      formId () {
        return parseInt(this.id)
      },
      form () {
        return this.$store.getters.loadedApplicationForm(this.slug, this.formId)
      },
      formTemplateId () {
        if (!this.form) {
          return null
        }
        return this.form.form_template.id
      },
      formTemplate () {
        return this.$store.getters.loadedFormTemplate(this.slug, this.formTemplateId)
      },
      statuses () {
        return this.$store.getters.statuses
      },
      periodStart () {
        return this.form.period_start ? this.form.period_start.substring(0, 10) : ''
      },
      periodEnd () {
        return this.form.period_end ? this.form.period_end.substring(0, 10) : ''
      },
      progressNumber () {
        return this.status === 'Open' ? this.progress(parseInt(this.formTemplateId), this.formId) : 100
      },
      status () {
        const status = this.statuses.find((status) => {
          return status.id === this.form.status_id
        })
        return status ? status.status : 'undefined'
      },
      submittable () {
        return this.formTemplate.allow_submit === 1
      },
      sendAble () {
        return this.submittable && this.status === 'Open' && this.progressNumber >= 100
      },
      formOwner () {
        if (this.form.organisation == null) {
          return this.form.user.first_name + ' ' + this.form.user.last_name
        } else {
          return this.form.organisation.name
        }
      },
      formPeriod () {
        if (this.periodStart && this.periodEnd) {
          return moment(this.periodStart).format('MMM Do YYYY') + ' - ' + moment(this.periodEnd).format('MMM Do YYYY')
        } else if (this.periodStart || this.periodEnd) {
          return this.periodStart ? moment(this.periodStart).format('MMM Do YYYY') : moment(this.periodEnd).format('MMM Do YYYY')
        } else {
          return null
        }
      },
      lastSaved () {
        return moment(this.form.updated_at.date).format('MMM Do YYYY h:mm A')
      },
      meta () {
        if (!this.formTemplate || !this.formTemplate.metas.length) {
          return null
        }
        return JSON.parse(this.formTemplate.metas[0].metadata)
      },
      content () {
        if (this.meta && this.meta.content) {
          return this.meta.content
        }
        return null
      },
      help () {
        if (this.meta && this.meta.help) {
          return this.meta.help
        }
        return null
      },
      user () {
        return this.$store.getters.user
      },
      roles () {
        return this.$store.getters.roles
      },
      isSuperUser () {
        return this.user && this.getRole(this.user.role_id) === 'Super Admin'
      },
      isAdmin () {
        return this.isSuperUser || (this.user && this.application && this.getRole(this.application.application_role_id) === 'Admin')
      }
    },
    methods: {
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      duplicateForm: function () {
        this.$store.dispatch('duplicateForm', {
          formTemplateId: this.formTemplateId,
          id: this.form.id
        })
          .then((response) => {
            this.duplicated = true
            this.duplicatedContent = response.data.form.id
          })
      },
      onOpenForm: function () {
        const statusIndex = _.findIndex(this.statuses, status => {
          return status.status === 'Open'
        })

        this.$store.dispatch('updateForm',
          {
            formTemplateId: this.formTemplateId,
            id: this.formId,
            statusId: this.statuses[statusIndex].id
          }
        )
      },
      onDeleteForm: function () {
        this.$store.dispatch('deleteForm',
          {
            formTemplateId: this.formTemplateId,
            id: this.formId
          }
        )
          .then(() => {
            this.$router.push('/forms')
          })
      },
      onSendForm: function () {
        const statusIndex = _.findIndex(this.statuses, status => {
          return status.status === 'Closed'
        })

        this.$store.dispatch('updateForm', {
          formTemplateId: this.formTemplateId,
          id: this.formId,
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
      this.$store.dispatch('loadOrganisations', this.slug)
      this.$store.dispatch('loadFormTemplates', this.slug)
      this.$store.dispatch('loadAllForm', {slug: this.slug, id: this.id})
        .then((response) => {
          this.$store.dispatch('loadSections', this.formTemplateId)
          this.$store.dispatch('loadValidations', this.formTemplateId)
          this.$store.dispatch('loadTriggers', this.formTemplateId)
        })
      this.$store.dispatch('selectSection', null)
      this.$store.dispatch('loadAllOrganisationUsers', this.slug)
    }
  }
</script>
