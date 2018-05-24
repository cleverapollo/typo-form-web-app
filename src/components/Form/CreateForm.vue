<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-card-text>
            <v-container>
              <v-layout row wrap>
                <v-flex>
                  <h1 class="mb-4">Create Form</h1>
                </v-flex>
              </v-layout>

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
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-btn color="info" @click=onCancel>Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              class="primary"
              :disabled="!formIsValid"
              @click="onCreateForm">Create Form
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['slug'],
    data () {
      return {
        name: ''
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
      formIsValid () {
        return this.name !== ''
      }
    },
    watch: {
      application (value) {
        if (this.getRole(value.application_role_id) === 'User') {
          this.$router.push('/applications/')
        }
      }
    },
    methods: {
      getRole (roleId) {
        const role = this.roles.find((role) => {
          return role.id === roleId
        })
        return role ? role.name : 'undefined'
      },
      onCreateForm () {
        if (!this.formIsValid || !this.userIsAdmin) {
          return
        }
        const formData = {
          slug: this.slug,
          name: this.name,
          periodStart: this.periodStart,
          periodEnd: this.periodDuration === 5 ? this.periodEnd : null,
          periodId: this.periodDuration !== 5 ? this.periodDuration : null,
          showProgress: this.showProgress,
          csv: this.csv
        }

        this.$store.dispatch('createForm', formData)
        this.$router.push('/' + this.slug + '/forms')
      },
      onCancel () {
        this.$router.push('/' + this.slug + '/forms')
      }
    }
  }
</script>
