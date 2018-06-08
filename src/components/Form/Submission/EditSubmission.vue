<template>
  <v-dialog width="600px" persistent v-model="editSubmission">
    <div slot="activator">
      Edit Submission
    </div>
    <v-card>
      <v-card-title>
        <div class="title mb-2 mt-2">Edit Sumission</div>
      </v-card-title>

      <v-card-text>
        <v-layout row wrap>

          <!-- //Teams -->
          <v-flex xs12>
            <v-select
              :items="teams"
              item-value="id"
              item-text="name"
              v-model="teamId"
              label="Team"
            ></v-select>
          </v-flex>

          <!-- //Users -->
          <v-flex xs12>
            <v-select
              :items="users"
              item-value="id"
              item-text="name"
              v-model="userId"
              label="User"
            ></v-select>
          </v-flex>
          
          <!-- //Period Start -->
          <v-flex xs12 sm6>

            <v-dialog
              ref="periodStartDialog"
              v-model="periodStartModal"
              :return-value.sync="periodStart"
              persistent
              lazy
              full-width
              width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="periodStart"
                prepend-icon="event"
                label="Period Start"
                readonly
              ></v-text-field>
              <v-date-picker v-model="periodStart" scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="periodStartModal = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.periodStartDialog.save(periodStart)">OK</v-btn>
              </v-date-picker>
            </v-dialog>

          </v-flex>

          <!-- //Period End -->
          <v-flex xs12 sm6>

            <v-dialog
              ref="periodEndDialog"
              v-model="periodEndModal"
              :return-value.sync="periodEnd"
              persistent
              lazy
              full-width
              width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="periodEnd"
                prepend-icon="event"
                label="Period End"
                readonly
              ></v-text-field>
              <v-date-picker v-model="periodEnd" scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="periodEndModal = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.periodEndDialog.save(periodEnd)">OK</v-btn>
              </v-date-picker>
            </v-dialog>

          </v-flex>
        </v-layout>
      </v-card-text>
      
      <v-divider></v-divider>
      <v-card-actions>
        <v-layout row py-2>
          <v-flex xs12 class="text-xs-right">
            <v-btn flat @click.stop="onCancel">Cancel</v-btn>
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
    props: ['slug', 'submission', 'formId'],
    data () {
      return {
        id: this.submission.id,
        editSubmission: false,
        periodStartModal: false,
        periodStart: this.submission.period_start ? this.submission.period_start.substring(0, 10) : null,
        periodEndModal: false,
        periodEnd: this.submission.period_end ? this.submission.period_end.substring(0, 10) : null,
        teamId: this.submission.team ? this.submission.team.id : null,
        userId: this.submission.user ? this.submission.user.id : null
      }
    },
    methods: {
      onSave () {
        this.editSubmission = false

        let submissionData = {
          id: this.id,
          formId: this.formId,
          teamId: this.teamId,
          userId: this.userId,
          periodStart: this.periodStart,
          periodEnd: this.periodEnd
        }

        this.$store.dispatch('updateSubmission', submissionData)
      },
      onCancel () {
        this.editSubmission = false
        this.periodStart = this.submission.period_start ? this.submission.period_start.substring(0, 10) : null
        this.periodEnd = this.submission.period_end ? this.submission.period_end.substring(0, 10) : null
        this.teamId = this.submission.team ? this.submission.team.id : null
        this.userId = this.submission.user ? this.submission.user.id : null
      }
    },
    computed: {
      loading () {
        return this.$store.getters.loading
      },
      teams () {
        return this.$store.getters.loadedTeams(this.slug)
      },
      users () {
        if (this.teamId) {
          return this.$store.getters.loadedSubmissionTeamUsers(this.teamId)
        }
        return this.$store.getters.loadedSubmissionUsers(this.slug)
      }
    },
    watch: {
      teamId (value) {
        if (value) {
          this.$store.dispatch('loadTeamUsers', {slug: this.slug, teamId: value})
        }
      }
    }
  }
</script>
