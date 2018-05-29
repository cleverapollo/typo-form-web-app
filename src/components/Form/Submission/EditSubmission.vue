<template>
  <v-dialog width="350px" persistent v-model="editSubmission">
    <div slot="activator">
      Edit Submission
    </div>
    <v-card>
      <v-card-title>
        <h2>Edit Submission</h2>
      </v-card-title>

      <v-card-text>
        <v-layout row wrap>
          <!-- //Period Start -->
          <v-flex xs12 sm6>
            <v-menu
              ref="periodStartMenu"
              :close-on-content-click="false"
              v-model="periodStartMenu"
              :nudge-right="40"
              :return-value.sync="periodStart"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="periodStart"
                label="Start Date"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="periodStart" @input="$refs.periodStartMenu.save(periodStart)"></v-date-picker>
            </v-menu>
          </v-flex>

          <!-- //Period End -->
          <v-flex xs12 sm6>
            <v-menu
              ref="periodEndMenu"
              :close-on-content-click="false"
              v-model="periodEndMenu"
              :nudge-right="40"
              :return-value.sync="periodEnd"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="periodEnd"
                label="End Date"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="periodEnd" @input="$refs.periodEndMenu.save(periodEnd)"></v-date-picker>
            </v-menu>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-layout row py-2>
          <v-flex xs12 class="text-xs-right">
            <v-btn flat @click.stop="onCancel">Close</v-btn>
            <v-btn
              flat
              class="primary"
              @click="onSave"
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
  export default {
    props: ['submission', 'formId'],
    data () {
      return {
        id: this.submission.id,
        editSubmission: false,
        periodStartMenu: false,
        periodStart: this.submission.period_start ? this.submission.period_start.substring(0, 10) : null,
        periodEndMenu: false,
        periodEnd: this.submission.period_end ? this.submission.period_end.substring(0, 10) : null
      }
    },
    methods: {
      onSave () {
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
        this.editSubmission = false
        this.periodStart = this.submission.period_start ? this.submission.period_start.substring(0, 10) : null
        this.periodEnd = this.submission.period_end ? this.submission.period_end.substring(0, 10) : null
      }
    },
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    }
  }
</script>
