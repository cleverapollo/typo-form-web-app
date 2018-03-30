<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-card-text>
            <v-container>
              <h1 class="mb-4">Create Form</h1>
              <form @submit.prevent="onCreateForm">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="name"
                      label="Name"
                      id="name"
                      v-model="name"
                      required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn
                      class="primary"
                      :disabled="!formIsValid"
                      type="submit">Create Form</v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['application_id'],
    data () {
      return {
        name: ''
      }
    },
    computed: {
      application () {
        return this.$store.getters.loadedApplication(parseInt(this.application_id))
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsAdmin () {
        console.log(this.application.application_role === 'Admin' || this.application.application_role === 'Super Admin')
        if (!this.userIsAuthenticated || !this.application) {
          return false
        }
        return this.application.application_role === 'Admin' || this.application.application_role === 'Super Admin'
      },
      formIsValid () {
        return this.name !== ''
      }
    },
    watch: {
      application (value) {
        if (value.application_role === 'User') {
          this.$router.push('/')
        }
      }
    },
    methods: {
      onCreateForm () {
        if (!this.formIsValid || !this.userIsAdmin) {
          return
        }
        const formData = {
          applicationid: this.application_id,
          name: this.name
        }
        this.$store.dispatch('createForm', formData)
        this.$router.push('/applications/' + this.application_id + '/forms')
      }
    },
    created: function () {
      this.$store.dispatch('loadApplications')
    }
  }
</script>
