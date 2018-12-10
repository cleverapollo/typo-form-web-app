<template>
  <v-dialog v-model="show" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <div class="title mb-2 mt-2">Create Form</div>
      </v-card-title>
      <v-card-text>

        <v-layout row wrap>

          <!-- //Form Templates -->
          <v-flex xs12>
            <v-autocomplete
              :items="formTemplates"
              item-value="id"
              item-text="name"
              v-model="formTemplateId"
              label="Form Template"
            ></v-autocomplete>
          </v-flex>

          <!-- //Users -->
          <v-flex xs12 v-if="userIsApplicationAdmin">
            <v-autocomplete
              :items="users"
              item-value="id"
              item-text="name"
              v-model="userId"
              label="User"
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
        formTemplateId: null,
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
      formTemplates () {
        return _.sortBy(this.$store.getters.loadedFormTemplates(this.slug), element => {
          return element.name.toLowerCase()
        })
      },
      roles () {
        return this.$store.getters.roles
      },
      users () {
        if (this.organisationId) {
          return this.$store.getters.loadedFormOrganisationUsers(this.organisationId)
        }
        return this.$store.getters.loadedFormUsers(this.slug)
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
          formTemplateId: this.formTemplateId,
          organisationId: this.organisationId,
          userId: this.userId
        }
        this.$store.dispatch('createForm', data)
          .then(response => {
            this.reset()

            // Redirect to the formTemplate
            if (response.data.form.id) {
              this.$router.push('/forms/' + response.data.form.id)
            }
          })
      },
      close () {
        this.reset()
      },
      reset () {
        this.formTemplateId = null
        this.organisationId = null
        this.userId = null
        this.show = false
      }
    }
  }
</script>
