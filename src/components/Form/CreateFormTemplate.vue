<template>
  <v-dialog v-model="show" persistent max-width="600">

    <v-alert :value="error" type="error">
      {{ errorString }}
    </v-alert>

    <v-card>

      <!-- //Title -->
      <v-card-title>
        <div class="title mb-2 mt-2">Create Form Template</div>
      </v-card-title>

      <!-- //Content -->
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              name="name"
              label="Name"
              id="name"
              v-model="name"
              required>
            </v-text-field>
          </v-flex>
        </v-layout>

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
      </v-card-text>

      <!-- //Actions -->
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout row py-2>
          <v-flex xs12 class="text-xs-right">
            <v-btn flat @click.stop="close">Cancel</v-btn>
            <v-btn class="primary" @click.stop="save" :disabled="!formTemplateIsValid">Save</v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: ['slug', 'visible'],
    data () {
      return {
        name: '',
        error: false,
        errorString: '',
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
      users () {
        if (this.organisationId) {
          return this.$store.getters.loadedFormOrganisationUsers(this.organisationId)
        }
        return this.$store.getters.loadedFormUsers(this.slug)
      },
      roles () {
        return this.$store.getters.roles
      },
      formTemplateIsValid () {
        return this.name !== ''
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
        if (!this.formTemplateIsValid) {
          return
        }

        const formTemplateData = {
          slug: this.slug,
          name: this.name,
          organisationId: this.organisationId,
          userId: this.userId
        }
        this.$store.dispatch('createFormTemplate', formTemplateData)
          .then(response => {
            this.close()

            // Redirect to the formTemplate Templates
            if (response.data.form_template.id) {
              this.$router.push('/form-builder/' + response.data.form_template.id)
            }
          })
          .catch(
            error => {
              this.errorString = error.response.data.message || error.response.data.name[0]
              this.error = true
            }
          )
      },
      close () {
        this.name = ''
        this.organisationId = null
        this.userId = null
        this.show = false
      }
    }
  }
</script>
