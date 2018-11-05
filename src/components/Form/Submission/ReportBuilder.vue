<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class="headline primary--text py-3">Report Builder</h1>

          <div class="text-xs-right">

            <!-- //Share Link -->
            <v-dialog v-model="joinUrlDialog" persistent max-width="600">
              <v-btn slot="activator" icon>
                <v-icon>share</v-icon>
              </v-btn>
              <v-card>
                <!-- //Title -->
                <v-card-title>
                  <div class="title mb-2 mt-2">Share Report</div>
                </v-card-title>

                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs12 pb-3>Share this report with others or bookmark the report to view again at a later date using the URL below.</v-flex>
                    <v-flex xs12 class="wrap-text">{{ joinURL }}</v-flex>
                  </v-layout>
                </v-card-text>

                <v-divider></v-divider>
                <v-card-actions>
                  <v-layout row py-2>
                    <v-flex xs12 class="text-xs-right">
                      <v-btn color="primary" @click="joinUrlDialog = false" >Close</v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </v-flex>
        <v-flex d-flex xs12>
          <p>Add filters below to start building your custom report, each filter will be displayed as a column in the report and you can add as many filters as you need.</p>
        </v-flex>
        <v-flex d-flex xs12>
          <v-card>

            <v-card-title>
                <div class="title">Filters</div>
              <v-container>

                <template v-for="(filter, index) in filters">

                  <ReportComponent
                    :filter="filter"
                    @deleteFilter="deleteFilter"
                    :key="'filter' + index"
                    :index="index"
                  />
                </template>

                <!-- // Action Buttons -->
                <v-layout row justify-center>
                  <v-flex xs3 px-3>
                    <v-btn block color="primary" @click.stop="addFilter">Add Filter</v-btn>
                  </v-flex>
                  <v-flex xs3 px-3>
                    <v-btn block color="success" @click.stop="applyFilters">Apply Filters</v-btn>
                  </v-flex>
                </v-layout>
              </v-container>

            </v-card-title>
            <v-divider></v-divider>

            <v-card-title>
              <div class="title">Results</div>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>

            <!-- // Data -->
            <v-data-table
              :headers="headers"
              :items="data"
              :search="search"
              :pagination.sync="pagination"
            >
              <template slot="items" slot-scope="props">
                <tr>
                  <template v-for="(item, key) in props.item">
                    <td v-bind:key="'filter'+key">{{item}}</td>
                  </template>
                </tr>
              </template>
              <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your filters returned no results. Try changing your filters.
              </v-alert>
              <v-alert slot="no-data" :value="true" color="error" icon="warning">
                Your filters returned no results. Try changing your filters.
              </v-alert>
            </v-data-table>

          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>

  </v-layout>
</template>

<script>
import * as _ from 'lodash'
import ReportComponent from './ReportComponent'
import QuestionCompareMixin from './QuestionCompareMixin.js'

export default {
  name: 'ReportBuilder',
  data () {
    return {
      search: '',
      headers: [],
      data: [],
      filters: [],
      filterTemplate: { source: '', query: '', value: '', answer: '' },
      slug: window.location.hostname.split('.')[0],
      joinUrlDialog: false,
      pagination: {
        rowsPerPage: 25
      }
    }
  },
  mixins: [QuestionCompareMixin],
  components: {
    ReportComponent
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    questions () {
      return this.$store.getters.loadedApplicationQuestions(this.slug)
    },
    joinURL () {
      return window.location.origin + '/report?filter=' + encodeURIComponent(JSON.stringify(this.filters))
    }
  },
  methods: {
    jsonCopy (src) {
      return JSON.parse(JSON.stringify(src))
    },
    deleteFilter (index) {
      this.filters.splice(index, 1)
    },
    addFilter () {
      const newFilter = this.jsonCopy(this.filterTemplate)
      this.filters.push(newFilter)
    },
    applyFilters () {
      this.setHeaders()
      this.setData()
    },
    setHeaders () {
      // Replace existing headers with new headers
      this.headers.splice(0, this.headers.length)
      _.forEach(this.filters, (filter, index) => {
        this.headers.push({ text: filter.source.question, value: 'filter' + index })
      })
    },
    setData () {
      // Remove existing data
      this.data.splice(0, this.data.length)
      // Filter Submissions
      let submissions = this.$store.getters.loadedAllSubmissions(this.slug)
      _.forEach(submissions, (submission, index) => {
        let row = {}
        _.forEach(this.filters, filter => {
          if (!filter.source) {
            return
          }
          if (filter.source.group === 'Submission Detail') {
            let response = ''
            switch (filter.source.question) {
              case 'Form':
                response = submission.form.name
                break
              case 'Owner':
                response = submission.user.first_name + ' ' + submission.user.last_name
                break
              case 'Owner Email':
                response = submission.user.email
                break
              case 'Team':
                response = submission.team.name
                break
              case 'Progress':
                response = submission.progress
                break
              case 'Period Start':
                response = submission.period_start
                break
              case 'Period End':
                response = submission.period_end
                break
              case 'Status':
                response = this.getStatus(submission.status_id)
                break
              case 'Created':
                response = submission.created_at.date
                break
              case 'Modified':
                response = submission.updated_at.date
                break
            }
            // Question, Responses, ComparatorID, QuestionTrigger.answer, QuestionTrigger.value
            const question = {question_type_id: 1, answers: []}
            const responses = [{answer_id: null, response: response}]
            if (filter.query !== '') {
              const compareResult = this.compareResponse(question, responses, filter.query, filter.answer, filter.value)
              if (compareResult) {
                row[filter.source.question] = response
              }
            } else {
              row[filter.source.question] = response
            }
          } else {
            const question = this.questions.find((question) => {
              return question.id === filter.source.id
            })
            const responses = submission.responses.filter((response) => {
              return response.question_id === filter.source.id
            })
            const order = Math.max(responses.map(response => response.order))
            for (let i = 1; i <= order; i++) {
              const orderResponses = responses.filter((response) => {
                return response.order === i
              })
              if (filter.query !== '') {
                const compareResult = this.compareResponse(question, orderResponses, filter.query, filter.answer, filter.value)
                if (compareResult) {
                  row[filter.source.question] = this.questionToResponse(question, orderResponses)
                  break
                }
              } else {
                row[filter.source.question] = this.questionToResponse(question, orderResponses)
                break
              }
            }
          }
        })
        if (Object.keys(row).length === this.filters.length) {
          this.data.push(row)
        }
      })
    }
  },
  created: function () {
    if (this.user) {
      this.$store.dispatch('loadAllSubmissions', this.slug)
      this.$store.dispatch('loadForms', this.slug)
        .then((response) => {
          const forms = response.data.forms
          _.forEach(forms, (form) => {
            this.$store.dispatch('loadSections', form.id)
          })
        })
        .then(() => {
          const filter = this.$route.query.filter
          if (filter) {
            this.filters = JSON.parse(decodeURIComponent(filter))
          }
          if (!this.filters.length) {
            this.addFilter()
          }
        })
    }
  }
}
</script>