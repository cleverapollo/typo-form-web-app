<template>
  <div>
    <v-btn
      block
      dark
      class="primary"
      @click.native.stop="createSubmission = true"
    >
      Create Submission
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
                  item-value="name"
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
    data () {
      return {
        createSubmission: false,
        submissionTypes: [
          {text: 'Anthonie'},
          {text: 'Zheming'},
          {text: 'CSC Company'}
        ],
        submissionType: 1
      }
    },
    methods: {
      onCreate () {
        this.createSubmission = false
      },
      onCancel () {
        this.questionType = 1
        this.createSubmission = false
      }
    },
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    }
  }
</script>
