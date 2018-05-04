<template>
  <div v-if="submissionTypes.length !== 0">
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
                ></v-select>
              </v-card-text>
            </v-flex>

            <v-spacer></v-spacer>

            <v-flex xs12>
              <v-menu
                class="px-3"
                lazy
                :close-on-content-click="false"
                v-model="startMenu"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
              >
                <v-text-field
                  slot="activator"
                  label="Period Start"
                  v-model="periodStart"
                  prepend-icon="event"
                  readonly
                ></v-text-field>

                <v-date-picker v-model="periodStart" no-title scrollable actions>
                  <template slot-scope="{ save, cancel }">
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                      <v-btn flat color="primary" @click="save">OK</v-btn>
                    </v-card-actions>
                  </template>
                </v-date-picker>
              </v-menu>
            </v-flex>

            <v-spacer></v-spacer>

            <v-flex xs12>
              <v-menu
                class="px-3"
                lazy
                :close-on-content-click="false"
                v-model="endMenu"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
              >
                <v-text-field
                  slot="activator"
                  label="Period End"
                  v-model="periodEnd"
                  prepend-icon="event"
                  readonly
                ></v-text-field>

                <v-date-picker v-model="periodEnd" no-title scrollable actions>
                  <template slot-scope="{ save, cancel }">
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                      <v-btn flat color="primary" @click="save">OK</v-btn>
                    </v-card-actions>
                  </template>
                </v-date-picker>
              </v-menu>
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
    props: ['slug', 'formId'],
    data () {
      return {
        createSubmission: false,
        submissionType: 0,
        startMenu: false,
        periodStart: null,
        endMenu: false,
        periodEnd: null,
        teamId: null
      }
    },
    methods: {
      onCreate () {
        this.createSubmission = false

        let submissionData = {
          formId: this.formId,
          periodStart: this.periodStart,
          periodEnd: this.periodEnd
        }

        if (this.submissionType !== 0) {
          submissionData.teamId = this.submissionType
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
        return this.$store.getters.loadedSubmissions(parseInt(this.formId))
      },
      teams () {
        return this.$store.getters.loadedTeams(this.slug)
      },
      submissionTypes () {
        return this.$store.getters.loadedSubmissionTeams(this.slug, parseInt(this.formId))
      }
    }
  }
</script>
