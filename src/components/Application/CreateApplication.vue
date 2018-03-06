<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-card-text>
            <v-container>
              <h1 class="mb-4">Create Application</h1>
              <form @submit.prevent="onCreateApplication">
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
                      type="submit">Create Application</v-btn>
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
    data () {
      return {
        name: ''
      }
    },
    computed: {
      formIsValid () {
        return this.name !== ''
      }
    },
    methods: {
      onCreateApplication () {
        if (!this.formIsValid) {
          return
        }
        const applicationData = {
          name: this.name
        }
        this.$store.dispatch('createApplication', applicationData)
        this.$router.push('/applications')
      }
    }
  }
</script>
