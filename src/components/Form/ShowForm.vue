<template>
  <div>
    <v-layout row wrap v-if="loading">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular
          indeterminate
          class="primary--text"
          :width="7"
          :size="70"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <v-card v-if="form">
          <v-card-title>
            <h1 class="primary--text">{{ form.name }}</h1>
            <v-spacer></v-spacer>
            <v-menu offset-y bottom left v-if='userIsAdmin'>
              <v-btn icon slot='activator'>
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile @click=''>
                  <v-list-tile-title>
                    <app-edit-form :form='form' :applicationName='applicationName'></app-edit-form>
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click=onDeleteForm>
                  <v-list-tile-title>Delete Form</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-card-text>
            <v-tabs v-model="active">
              <v-tabs-bar class="primary" dark>
                <v-tabs-item
                  href='#questions'
                  v-if='userIsAdmin'
                  ripple
                >
                  Questions
                </v-tabs-item>
                <v-tabs-item
                  href='#responses'
                  ripple
                >
                  Responses
                </v-tabs-item>
                <v-tabs-slider color='white'></v-tabs-slider>
              </v-tabs-bar>
              <v-tabs-items>
                <v-tabs-content id='questions'>
                  <form-view :applicationName='applicationName' :formId='id' :submissionId='-1'></form-view>
                </v-tabs-content>
                <v-tabs-content id='responses'>
                  <responses :applicationName='applicationName' :formId='id'></responses>
                </v-tabs-content>
              </v-tabs-items>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import formView from './FormView'
  import responses from './Submission/Submissions'

  export default {
    props: ['applicationName', 'id'],
    components: {
      formView,
      responses
    },
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
        return this.$store.getters.loadedApplication(this.applicationName)
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
        return this.$store.getters.loadedForm(this.applicationName, parseInt(this.id))
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onDeleteForm () {
        this.$store.dispatch('deleteForm', {
          applicationName: this.applicationName,
          id: this.id
        })
        this.$router.push('/' + this.applicationName + '/forms')
      }
    },
    created: function () {
      this.$store.dispatch('loadApplications')
      this.$store.dispatch('loadTeams', this.applicationName)
      this.$store.dispatch('loadForms', this.applicationName)
      this.$store.dispatch('loadSections', this.id)
      this.$store.dispatch('loadSubmissions', this.id)
      this.$store.dispatch('loadValidations', this.id)
    }
  }
</script>
