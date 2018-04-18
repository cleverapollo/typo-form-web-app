<template>
  <div>
    <v-btn
      block
      white
      @click.native.stop="editSubmission = true"
    >
      <v-icon>edit</v-icon>
    </v-btn>

    <v-dialog width="350px" persistent v-model="editSubmission">
      <v-card>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card-title>
                <h2>Edit Submission</h2>
              </v-card-title>
            </v-flex>
          </v-layout>

          <v-divider></v-divider>

          <v-layout row wrap>
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
                  @click="onEdit"
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
    props: ['submission', 'formId'],
    data () {
      return {
        id: this.submission.id,
        editSubmission: false,
        startMenu: false,
        periodStart: this.submission.period_start ? this.submission.period_start.substring(0, 10) : null,
        endMenu: false,
        periodEnd: this.submission.period_end ? this.submission.period_end.substring(0, 10) : null
      }
    },
    methods: {
      onEdit () {
        this.editSubmission = false

        let submissionData = {
          id: this.id,
          formId: this.formId,
          periodStart: this.periodStart,
          periodEnd: this.periodEnd
        }

        this.$store.dispatch('updateSubmission', submissionData)
      },
      onCancel () {
        this.questionType = 1
        this.editSubmission = false
      }
    },
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    }
  }
</script>
