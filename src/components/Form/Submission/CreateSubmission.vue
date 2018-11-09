<template>
  <v-dialog v-model="show" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <div class="title mb-2 mt-2">Create Form</div>
      </v-card-title>
      <v-card-text>

        <v-layout row wrap>

          <!-- //Form Builders -->
          <v-flex xs12>
            <v-autocomplete
              :items="forms"
              item-value="id"
              item-text="name"
              v-model="formId"
              label="Form Builder"
            ></v-autocomplete>
          </v-flex>

          <!-- //Users -->
          <v-flex xs12 v-if="userIsApplicationAdmin">
            <v-autocomplete
              :items="users"
              item-value="id"
              item-text="name"
              v-model="userId"
              label="Owner"
            ></v-autocomplete>
          </v-flex>

          <!-- //Organisations -->
          <v-flex xs12 v-if="organisations.length">
            <v-autocomplete
              :items="organisations"
              item-value="id"
              item-text="name"
              v-model="organisationId"
              label="Organisation"
            ></v-autocomplete>
          </v-flex>

          <!-- //Period Start -->
          <div class="body-2">Is this form for a set period? If so, set the date below (optional)</div>
          <v-flex xs12 sm6>

            <v-dialog
              ref="periodStartDialog"
              v-model="periodStartModal"
              :return-value.sync="periodStart"
              persistent
              lazy
              full-width
              width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="periodStart"
                prepend-icon="event"
                label="Period Start"
                readonly
              ></v-text-field>
              <v-date-picker v-model="periodStart" scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="periodStartModal = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.periodStartDialog.save(periodStart)">OK</v-btn>
              </v-date-picker>
            </v-dialog>

          </v-flex>

          <!-- //Period End -->
          <v-flex xs12 sm6>

            <v-dialog
              ref="periodEndDialog"
              v-model="periodEndModal"
              :return-value.sync="periodEnd"
              persistent
              lazy
              full-width
              width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="periodEnd"
                prepend-icon="event"
                label="Period End"
                readonly
              ></v-text-field>
              <v-date-picker v-model="periodEnd" scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="periodEndModal = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.periodEndDialog.save(periodEnd)">OK</v-btn>
              </v-date-picker>
            </v-dialog>

          </v-flex>

        </v-layout>

      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout row py-2>
          <v-flex xs12 class="text-xs-right">
            <v-btn flat @click.stop="close">Cancel</v-btn>
            <v-btn
              flat
              class="primary"
              @click="save"
              :disabled="loading"
              :loading="loading"
            >
              Save
              <span slot="loader" class="custom-loader">
                <v-icon light>cached</v-icon>
              </span>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import * as _ from 'lodash'
  export default {
    props: ['visible', 'slug'],
    data () {
      return {
        formId: null,
        periodStart: null,
        periodEnd: null,
        periodStartModal: false,
        periodEndModal: false,
        organisationId: null,
        userId: null
      }
    },
    computed: {
      show: {
        get () {
          return this.visible
        },
        set (value) {
          if (!value) {
            this.$emit('close')
          }
        }
      },
      organisations () {
        return this.$store.getters.loadedOrganisations(this.slug)
      },
      forms () {
        return _.sortBy(this.$store.getters.loadedForms(this.slug), element => {
          return element.name.toLowerCase()
        })
      },
      roles () {
        return this.$store.getters.roles
      },
      users () {
        if (this.organisationId) {
          return this.$store.getters.loadedSubmissionOrganisationUsers(this.organisationId)
        }
        return this.$store.getters.loadedSubmissionUsers(this.slug)
      },
      loading () {
        return this.$store.getters.loading
      },
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
      }
    },
    methods: {
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      save () {
        let data = {
          formId: this.formId,
          organisationId: this.organisationId,
          userId: this.userId,
          periodStart: this.periodStart,
          periodEnd: this.periodEnd
        }
        this.$store.dispatch('createSubmission', data)
          .then(response => {
            this.reset()

            // Redirect to the form
            if (response.data.submission.id) {
              this.$router.push('/submissions/' + response.data.submission.id)
            }
          })
      },
      close () {
        this.reset()
      },
      reset () {
        this.formId = null
        this.periodStart = null
        this.periodEnd = null
        this.periodStartMenu = false
        this.periodEndMenu = false
        this.organisationId = null
        this.userId = null
        this.show = false
      }
    }
  }
</script>
