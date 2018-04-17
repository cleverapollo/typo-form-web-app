<template>
  <div>
    <v-btn
      block
      dark
      class="primary"
      @click.native.stop="createSubmission = true"
    >
      <v-icon>add</v-icon>
    </v-btn>

    <v-dialog width="350px" persistent v-model="createSubmission">
      <v-card>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card-title>
                <h2>Create Submission</h2>
              </v-card-title>
            </v-flex>
          </v-layout>

          <v-divider></v-divider>

          <v-layout row wrap>
            <v-flex xs12>
              <v-card-text>
                <v-select
                  :items="submissionTypes"
                  item-value="id"
                  item-text="name"
                  v-model="submissionType"
                  label="Submission Type"
                  single-line
                ></v-select>
              </v-card-text>
            </v-flex>
          </v-layout>

          <v-divider></v-divider>

          <v-layout row wrap>
            <v-flex xs12>
              <v-card-actions>
                <v-btn
                  flat
                  class="secondary"
                  @click="onCancel"
                >
                  Close
                </v-btn>

                <v-btn
                  flat
                  class="primary"
                  @click="onCreate"
                  :disabled="loading"
                  :loading="loading"
                >
                  Save
                  <span slot="loader" class="custom-loader">
                    <v-icon light>cached</v-icon>
                  </span>
                </v-btn>
              </v-card-actions>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    props: ['application_id', 'form_id'],
    data () {
      return {
        createSubmission: false,
        submissionType: 1
      }
    },
    methods: {
      onCreate () {
        this.createSubmission = false

        let submissionData = {
          formid: this.form_id
        }

        if (this.submissionType !== 1) {
          submissionData = {
            formid: this.form_id,
            team_id: this.submissionType
          }
        }

        this.$store.dispatch('createSubmission', submissionData)
      },
      onCancel () {
        this.questionType = 1
        this.createSubmission = false
      }
    },
    computed: {
      loading () {
        return this.$store.getters.loading
      },
      submissions () {
        return this.$store.getters.loadedSubmissions(parseInt(this.form_id))
      },
      teams () {
        return this.$store.getters.loadedTeams(parseInt(this.application_id))
      },
      submissionTypes () {
        return [
          {id: 1, name: 'Your Self'},
          {id: 2, name: 'Team'}
        ]
      }
    }
  }
</script>
