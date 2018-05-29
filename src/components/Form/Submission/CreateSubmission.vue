<template>
  <v-dialog v-model="show" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <div class="title mb-2 mt-2">Create Sumission</div>
      </v-card-title>
      <v-card-text>

        <v-layout row wrap>

          <!-- //Forms -->
          <v-flex xs12>
            <v-select
              :items="forms"
              item-value="id"
              item-text="name"
              v-model="formId"
              label="Form Type"
            ></v-select>
          </v-flex>

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
            <v-btn flat @click.stop="close">Cancel</v-btn>
            <v-btn
              flat
              class="primary"
              @click="save"
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
  import * as _ from 'lodash'
  export default {
    data () {
      return {
        formId: null,
        periodStart: null,
        periodEnd: null,
        periodStartMenu: false,
        periodEndMenu: false,
        teamId: null,
        userId: null
      }
    },
    computed: {
      show: {
        get () {
          return this.visible
        },
        set (value) {
          if (!value) {
            this.$emit('close')
          }
        }
      },
      teams () {
        return this.$store.getters.loadedTeams(this.slug)
      },
      forms () {
        return _.sortBy(this.$store.getters.loadedForms(this.slug), element => {
          return element.name.toLowerCase()
        })
      },
      users () {
        if (this.teamId) {
          return this.$store.getters.loadedSubmissionTeamUsers(this.teamId)
        }
        return this.$store.getters.loadedSubmissionUsers(this.slug)
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    watch: {
      teamId (value) {
        if (value) {
          this.$store.dispatch('loadTeamUsers', {slug: this.slug, teamId: value})
        }
      }
    },
    methods: {
      save () {
        let data = {
          formId: this.formId,
          teamId: this.teamId,
          userId: this.userId,
          periodStart: this.periodStart,
          periodEnd: this.periodEnd
        }
        this.$store.dispatch('createSubmission', data)
          .then(response => {
            this.reset()
          })
      },
      close () {
        this.reset()
      },
      reset () {
        this.formId = null
        this.periodStart = null
        this.periodEnd = null
        this.periodStartMenu = false
        this.periodEndMenu = false
        this.teamId = null
        this.userId = null
        this.show = false
      }
    },
    props: ['visible', 'slug']
  }
</script>