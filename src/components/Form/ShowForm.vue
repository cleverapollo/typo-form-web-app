<template>
  <div>
    <v-layout row wrap v-if="loading">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular
          indeterminate
          class="primary--text"
          :width="7"
          :size="70"
        ></v-progress-circular>
      </v-flex>
    </v-layout>

    <v-layout row wrap v-else>
      <v-flex xs12>
        <div v-if="form">
          <v-card-title>
            <h1 class="primary--text">{{ form.name }}</h1>

            <v-spacer></v-spacer>

            <v-btn @click=onBack class="primary">Back</v-btn>

            <v-menu offset-y bottom left v-if="view === 'questions' && userIsAdmin">
              <v-btn icon slot="activator">
                <v-icon>more_vert</v-icon>
              </v-btn>

              <v-list>
                <v-list-tile @click="">
                  <v-list-tile-title>
                    <app-create-section
                      :parentSectionId="-1"
                      :formId="id"
                    ></app-create-section>
                  </v-list-tile-title>
                </v-list-tile>

                <v-list-tile @click="">
                  <v-list-tile-title>
                    <app-edit-form :form="form" :slug="slug"></app-edit-form>
                  </v-list-tile-title>
                </v-list-tile>


                <v-list-tile @click=onDeleteForm>
                  <v-list-tile-title>Delete Form</v-list-tile-title>
                </v-list-tile>

                <v-list-tile @click=onUploadCSV>
                  <v-list-tile-title>Upload CSV</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-card-title>

          <h3 class="pl-3">
            <template v-if="form.period_start">Period: from {{ form.period_start.split(' ')[0] }}</template>
            <template v-if="form.period_id"> for {{ period }}</template>
            <template v-if="form.period_end"> to {{ form.period_end.split(' ')[0] }}</template>
          </h3>

          <form-view
            :slug="slug"
            :formId="id"
            :submissionId="-1"
            :isAdmin="userIsAdmin"
            :view="view"
            v-if="view === 'questions' && userIsAdmin"
          ></form-view>

          <submissions
            :slug="slug"
            :formId="id"
            :isAdmin="userIsAdmin"
            :view="view"
            v-else
          ></submissions>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import FormView from './FormView'
  import Submissions from './Submission/Submissions'

  export default {
    components: {
      Submissions,
      FormView
    },
    props: ['slug', 'id', 'view'],
    data () {
      return {
        active: null
      }
    },
    computed: {
      roles () {
        return this.$store.getters.roles
      },
      application () {
        return this.$store.getters.loadedApplication(this.slug)
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsAdmin () {
        if (!this.userIsAuthenticated || !this.application) {
          return false
        }
        return this.getRole(this.application.application_role_id) === 'Admin'
      },
      form () {
        return this.$store.getters.loadedForm(this.slug, parseInt(this.id))
      },
      loading () {
        return this.$store.getters.loading
      },
      period () {
        if (this.form.period_id) {
          const periods = this.$store.getters.periods
          const index = periods.findIndex(function (period) {
            return period.id === this.form.period_id
          }.bind(this))
          return periods[index].period
        }
        return null
      }
    },
    methods: {
      onBack () {
        if (this.view === 'responses') {
          this.$router.push('/' + this.slug + '/submissions')
        } else {
          this.$router.push('/' + this.slug + '/forms')
        }
      },
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onDeleteForm () {
        this.$store.dispatch('deleteForm', {
          slug: this.slug,
          id: this.form.id
        })
        this.$router.push('/' + this.slug + '/forms')
      },
      onUploadCSV () {

      }
    },
    created: function () {
      this.$store.dispatch('loadTeams', this.slug)
      this.$store.dispatch('loadForms', this.slug)
      this.$store.dispatch('loadSections', this.id)
      this.$store.dispatch('loadSubmissions', this.id)
      this.$store.dispatch('loadValidations', this.id)
      // this.$store.dispatch('loadTriggers', this.id)
      this.$store.dispatch('selectSection', null)
    }
  }
</script>
