<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <div class="subheading py-2 px-3">Filtered Submissions</div>
        </v-flex>
        <v-flex d-flex xs12>
          <v-card>

          <!-- //Filter -->
          <template v-for="(element, index) in filters">
            <v-layout wrap>
              <v-flex xs10 offset-xs1 sm1 offset-sm1 d-flex text-xs-center text-sm-left>
                <div class="subheading pa-0" v-if="index">AND</div>
              </v-flex>
              <v-flex xs10 offset-xs1 sm2 offset-sm0 d-flex>
                <v-autocomplete
                  :items="sources"
                  label="Source"
                  v-model="element.source"
                  single-line
                  required
                  return-object
                >
                  <template
                    slot="selection"
                    slot-scope="data"
                  >
                    {{ data.item.question }}
                  </template>
                  <template
                    slot="item"
                    slot-scope="data"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title>{{data.item.question}}</v-list-tile-title>
                      <v-list-tile-sub-title>{{data.item.group}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </template>
                </v-autocomplete>
              </v-flex>
              <v-flex xs10 offset-xs1 sm2 offset-sm1 d-flex>
                <v-select
                  :items="filterComparators"
                  item-text="comparator"
                  item-value="id"
                  v-model="element.query"
                  label="Comparator"
                  single-line
                  required
                ></v-select>
              </v-flex>
              <v-flex xs10 offset-xs1 sm2 offset-sm1 d-flex>
                <v-text-field
                  label="Value"
                  v-model="element.value"
                  single-line
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs10 offset-xs1 sm1 offset-sm0 text-xs-center text-sm-right>
                <v-btn flat icon @click="removeFilter(index)" class="mt-3">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </template>

          <!-- //Add Row -->
          <v-layout row>
            <v-flex xs10 offset-xs1 offset-sm2 class="text-xs-left">
              <v-btn flat color="info" @click.stop="addFilter">Add Filter</v-btn>
              <v-btn flat color="success" @click.stop="applyFilter">Apply Filter</v-btn>
            </v-flex>
          </v-layout>

            <!-- //Submissions -->
            <v-data-table
              :headers="headers"
              :items="submissions"
              :search="search"
              hide-actions
              v-if="loadedSubmissionFilters"
            >
              <template slot="items" slot-scope="props">
                <tr @click="onSubmission(props.item.id)" v-if="loadedSubmissionFilters.indexOf(props.item.id) !== -1">
                  <td>{{ props.item.form.name }}</td>
                  <td>{{ props.item.owner }}</td>
                  <td>{{ props.item.created_at.date | moment }}</td>
                  <td>{{ props.item.updated_at.date | moment }}</td>
                  <td>{{ props.item.status }}</td>
                </tr>
              </template>
              <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search for "{{ search }}" found no results.
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
  import moment from 'moment'

  export default {
    name: 'SubmissionFilter',
    props: ['slug'],
    data () {
      return {
        search: '',
        filters: [{ source: '', query: '', value: '' }]
      }
    },
    computed: {
      headers () {
        // let headers = []
        _.forEach(this.filters, function (filter) {
          if (filter.source.group === 'Submission Detail') {
            // if (filter.source.question === 'id')
          }
        })
        return [
          { text: 'Submission', value: 'form.name', sortable: true, align: 'left' },
          { text: 'Owner', value: 'owner', sortable: true, align: 'left' },
          { text: 'Created', value: 'created_at.date', sortable: true, align: 'left' },
          { text: 'Modified', value: 'updated_at.date', sortable: true, align: 'left' },
          { text: 'Status', value: 'status', sortable: true, align: 'left' }
        ]
      },
      submissions () {
        let submissions = this.$store.getters.loadedAllSubmissions(this.slug)
        submissions.forEach((submission) => {
          submission.owner = submission.team ? submission.team.name : submission.user.first_name + ' ' + submission.user.last_name
          submission.status = this.status(submission.status_id)
        })
        return submissions
      },
      statuses () {
        return this.$store.getters.statuses
      },
      comparators () {
        return this.$store.getters.comparators
      },
      filterComparators () {
        return this.comparators.filter((comparator) => {
          return comparator.comparator !== 'is invalid'
        })
      },
      sources () {
        let sources = [
          {'group': 'Submission Detail', 'question': 'id'},
          {'group': 'Submission Detail', 'question': 'form_id'},
          {'group': 'Submission Detail', 'question': 'user_id'},
          {'group': 'Submission Detail', 'question': 'team_id'},
          {'group': 'Submission Detail', 'question': 'progress'},
          {'group': 'Submission Detail', 'question': 'period_start'},
          {'group': 'Submission Detail', 'question': 'period_end'},
          {'group': 'Submission Detail', 'question': 'status_id'},
          {'group': 'Submission Detail', 'question': 'updated_at'}
        ]
        const questions = this.$store.getters.loadedApplicationQuestions(this.slug)
        _.forEach(questions, (question) => {
          sources.push({'group': question.form_name + '-' + question.section_name, 'question': question.question, 'id': question.id})
        }, this)
        return sources
      },
      loadedSubmissionFilters () {
        return this.$store.getters.loadedSubmissionFilters().submission_ids
      }
    },
    methods: {
      onSubmission (id) {
        this.$router.push('/' + this.slug + '/submissions/' + id)
      },
      status (id) {
        return this.statuses.find(e => { return e.id === id }).status
      },
      onDeleteSubmission: function (formId, id) {
        this.$store.dispatch('deleteSubmission',
          {
            formId: formId,
            id: id
          }
        )
      },
      addFilter () {
        this.filters.push({ source: '', query: '', value: '' })
      },
      applyFilter () {
        if (!this.filters.length) {
          return
        }
        let filterParameters = []
        for (let i = 0; i < this.filters.length; i++) {
          if (!this.filters[i].source) {
            continue
          }
          let newParameter = {}
          if (this.filters[i].source.group === 'Submission Detail') {
            newParameter = {
              source: this.filters[i].source.question,
              query: this.filters[i].query,
              value: this.filters[i].value
            }
          } else {
            newParameter = {
              source: 'question_id',
              question_id: this.filters[i].source.id,
              query: this.filters[i].query,
              value: this.filters[i].value
            }
          }
          filterParameters.push(newParameter)
        }
        this.$store.dispatch('submissionFilter', {filters: filterParameters, slug: this.slug})
      },
      removeFilter (index) {
        this.filters.splice(index, 1)
      }
    },
    created: function () {
      this.$store.dispatch('loadUsers', this.slug)
      this.$store.dispatch('loadTeams', this.slug)
      this.$store.dispatch('loadForms', this.slug)
        .then((response) => {
          const forms = response.data.forms
          _.forEach(forms, (form) => {
            this.$store.dispatch('loadSections', form.id)
          })
        })
      this.$store.dispatch('loadAllSubmissions', this.slug)
    },
    filters: {
      moment: function (date) {
        return moment(date).format('YYYY-MM-DD h:MM A')
      }
    }
  }
</script>