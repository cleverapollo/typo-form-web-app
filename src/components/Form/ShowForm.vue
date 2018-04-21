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

            <v-btn color="info" @click=onBack>
              Back
            </v-btn>

            <v-menu offset-y bottom left v-if="userIsAdmin">
              <v-btn icon slot="activator">
                <v-icon>more_vert</v-icon>
              </v-btn>

              <v-list>
                <v-list-tile @click="">
                  <v-list-tile-title>
                    <app-edit-form :form="form" :applicationName="applicationName"></app-edit-form>
                  </v-list-tile-title>
                </v-list-tile>

                <v-list-tile @click=onDeleteForm>
                  <v-list-tile-title>Delete Form</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :items="menu"
              hide-actions
              hide-headers
            >
              <template slot="items" slot-scope="props">
                <td @click=navigate(props.item)>{{ props.item }}</td>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
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
      menu () {
        if (this.userIsAdmin) {
          return ['Questions', 'Responses']
        } else {
          return ['Responses']
        }
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onBack () {
        this.$router.push('/' + this.applicationName + '/forms')
      },
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onDeleteForm () {
        this.$store.dispatch('deleteForm', {
          applicationName: this.applicationName,
          id: this.form.id
        })
        this.$router.push('/' + this.applicationName + '/forms')
      },
      navigate (item) {
        this.$router.push('/' + this.applicationName + '/forms/show/' + this.id + '/' + item.toLowerCase())
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
