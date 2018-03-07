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
      formIsValid () {
        return this.name !== ''
      }
    },
    methods: {
      onCreateForm () {
        if (!this.formIsValid) {
          return
        }
        const formData = {
          name: this.name
        }
        this.$store.dispatch('createForm', parseInt(this.application_id), formData)
        this.$router.push('/applications/' + this.application_id + '/forms')
      }
    }
  }
</script>
