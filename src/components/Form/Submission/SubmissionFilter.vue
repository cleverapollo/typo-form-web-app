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
                  item-text="question"
                  item-value="question"
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
                  :items="filterComparators(element.source)"
                  item-text="comparator"
                  item-value="id"
                  v-model="element.query"
                  label="Comparator"
                  single-line
                  required
                ></v-select>
              </v-flex>
              <v-flex xs10 offset-xs1 sm1 offset-sm1 d-flex v-if="element.source.group != 'Submission Detail'">
                <v-autocomplete
                  :items="answers(element.source)"
                  item-text="answer"
                  item-value="id"
                  v-model="element.answer"
                  label="Value"
                  single-line
                ></v-autocomplete>
              </v-flex>
              <v-flex xs10 offset-xs1 sm1 offset-sm1 d-flex>
                <v-flex xs12 v-if="questionType(element.source) == 8 || questionType(element.source) == 9">
                  <v-autocomplete
                    v-model="element.value"
                    :items="values(element.source)"
                    item-text="answer"
                    item-value="id"
                    label="Value"
                    single-line
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 v-else>
                  <v-text-field
                    label="Value"
                    type="text"
                    v-model="element.value"
                  ></v-text-field>
                </v-flex>
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
    data () {
      return {
        search: '',
        filters: [{ source: '', query: '', value: '', answer: '' }],
        slug: window.location.hostname.split('.')[0]
      }
    },
    computed: {
      triggerTypes () {
        return this.$store.getters.triggerTypes.filter(e => {
          return e.question_type_id === this.parentQuestionType
        })
      },
      headers () {
        let headers = []
        _.forEach(this.filters, function (filter) {
          if (filter.source.group === 'Submission Detail') {
            if (filter.source.question === 'ID') {
              headers.push({ text: 'ID', value: 'id', sortable: true, align: 'left' })
            } else if (filter.source.question === 'Form ID') {
              headers.push({ text: 'Form ID', value: 'form.id', sortable: true, align: 'left' })
            } else if (filter.source.question === 'Form') {
              headers.push({ text: 'Form', value: 'form.name', sortable: true, align: 'left' })
            } else if (filter.source.question === 'User ID') {
              headers.push({ text: 'User ID', value: 'user.id', sortable: true, align: 'left' })
            } else if (filter.source.question === 'User') {
              headers.push({ text: 'User', value: 'user.name', sortable: true, align: 'left' })
            } else if (filter.source.question === 'Team ID') {
              headers.push({ text: 'Team ID', value: 'team.id', sortable: true, align: 'left' })
            } else if (filter.source.question === 'Team') {
              headers.push({ text: 'Team', value: 'team.name', sortable: true, align: 'left' })
            } else if (filter.source.question === 'Progress') {
              headers.push({ text: 'Progress', value: 'progress', sortable: true, align: 'left' })
            } else if (filter.source.question === 'Period Start') {
              headers.push({ text: 'Period Start', value: 'period_start', sortable: true, align: 'left' })
            } else if (filter.source.question === 'Period End') {
              headers.push({ text: 'Period End', value: 'period_end', sortable: true, align: 'left' })
            } else if (filter.source.question === 'Status') {
              headers.push({ text: 'Status', value: 'status', sortable: true, align: 'left' })
            } else if (filter.source.question === 'Created Date') {
              headers.push({ text: 'Created Date', value: 'created_at.date', sortable: true, align: 'left' })
            } else if (filter.source.question === 'Updated Date') {
              headers.push({ text: 'Updated Date', value: 'updated_at.date', sortable: true, align: 'left' })
            }
          } else {
            headers.push({ text: filter.source.question, value: filter.source.question, sortable: false, align: 'left' })
          }
        })
        return headers
      },
      submissions () {
        let submissions = this.$store.getters.loadedAllSubmissions(this.slug)
        submissions.forEach((submission) => {
          submission.user.name = submission.user.first_name + ' ' + submission.user.last_name
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
      sources () {
        let sources = [
          {'group': 'Submission Detail', 'question': 'ID'},
          {'group': 'Submission Detail', 'question': 'Form ID'},
          {'group': 'Submission Detail', 'question': 'Form'},
          {'group': 'Submission Detail', 'question': 'User ID'},
          {'group': 'Submission Detail', 'question': 'User'},
          {'group': 'Submission Detail', 'question': 'Team ID'},
          {'group': 'Submission Detail', 'question': 'Team'},
          {'group': 'Submission Detail', 'question': 'Progress'},
          {'group': 'Submission Detail', 'question': 'Period Start'},
          {'group': 'Submission Detail', 'question': 'Period End'},
          {'group': 'Submission Detail', 'question': 'Status'},
          {'group': 'Submission Detail', 'question': 'Created Date'},
          {'group': 'Submission Detail', 'question': 'Updated Date'}
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
      question (source) {
        if (!source.group) {
          return null
        }

        if (source.group === 'Submission Detail') {
          return null
        }

        const formName = source.group.split('-')[0]
        const form = this.$store.getters.loadedForms(this.slug).find((form) => {
          return form.name === formName
        })
        const question = this.$store.getters.loadedAllQuestion(form.id, this.source.id)
        return question
      },
      questionType (source) {
        const question = this.question(source)
        if (!question) {
          return null
        }
        return question.question_type_id
      },
      values (source) {
        const question = this.question(source)
        if (!question) {
          return []
        }

        return this.question(source).answers.filter(e => {
          return e.parameter
        })
      },
      answers (source) {
        const question = this.question(source)
        if (!question) {
          return []
        }

        if (this.questionType(source) === 8 || this.questionType(source) === 9) {
          return question.answers.filter(e => {
            return !e.parameter
          })
        }
        return this.question(source).answers
      },
      filterComparators (source) {
        if (source.group === 'Submission Detail') {
          if (source.question === 'Form' || source.question === 'User' || source.question === 'Team' || source.question === 'Status') {
            return this.comparators.filter((comparator) => {
              return comparator.comparator === 'equals' ||
                comparator.comparator === 'not equal to' ||
                comparator.comparator === 'contains' ||
                comparator.comparator === 'starts with' ||
                comparator.comparator === 'ends with' ||
                comparator.comparator === 'is null' ||
                comparator.comparator === 'is not null' ||
                comparator.comparator === 'in list' ||
                comparator.comparator === 'not in list' ||
                comparator.comparator === 'does not contain'
            })
          }
          return this.comparators.filter((comparator) => {
            return comparator.comparator !== 'is invalid' &&
              comparator.comparator !== 'contains' &&
              comparator.comparator !== 'does not contain' &&
              comparator.comparator !== 'starts with' &&
              comparator.comparator !== 'ends with'
          })
        }
        return this.comparators.filter((comparator) => {
          return this.triggerTypes.map(x => x.comparator_id).includes(comparator.id)
        })
      },
      onSubmission (id) {
        this.$router.push('/submissions/' + id)
      },
      status (id) {
        return this.statuses.find(e => { return e.id === id }).status
      },
      addFilter () {
        this.filters.push({ source: '', query: '', value: '', answer: '' })
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
              value: this.filters[i].value,
              answer: this.filters[i].answer
            }
          } else {
            newParameter = {
              source: 'Question',
              question_id: this.filters[i].source.id,
              query: this.filters[i].query,
              value: this.filters[i].value,
              answer: this.filters[i].answer
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
