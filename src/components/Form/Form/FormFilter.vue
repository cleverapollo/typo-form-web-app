<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <div class="subheading py-2 px-3">Filtered Forms</div>
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
              <v-flex xs10 offset-xs1 sm1 offset-sm1 d-flex v-if="element.source.group != 'Form Detail'">
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

            <!-- //Forms -->
            <v-data-table
              :headers="headers"
              :items="forms"
              :search="search"
              :rows-per-page-items="[25, 50, 100, { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }]"
              v-if="loadedFormFilters"
            >
              <template slot="items" slot-scope="props">
                <tr @click="onForm(props.item.id)" v-if="loadedFormFilters.indexOf(props.item.id) !== -1">
                  <td>{{ props.item.form_template.name }}</td>
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
  import UserMixin from '../../Layout/UserMixin'

  export default {
    name: 'FormFilter',
    data () {
      return {
        search: '',
        filters: [{ source: '', query: '', value: '', answer: '' }],
        slug: window.location.hostname.split('.')[0]
      }
    },
    mixins: [UserMixin],
    computed: {
      triggerTypes () {
        return this.$store.getters.triggerTypes.filter(e => {
          return e.question_type_id === this.parentQuestionType
        })
      },
      headers () {
        let headers = []
        _.forEach(this.filters, function (filter) {
          if (filter.source.group === 'Form Detail') {
            if (filter.source.question === 'ID') {
              headers.push({ text: 'ID', value: 'id', sortable: true, align: 'left' })
            } else if (filter.source.question === 'Form Template ID') {
              headers.push({ text: 'Form Template ID', value: 'form_template.id', sortable: true, align: 'left' })
            } else if (filter.source.question === 'Form Template') {
              headers.push({ text: 'Form Template', value: 'form_template.name', sortable: true, align: 'left' })
            } else if (filter.source.question === 'User ID') {
              headers.push({ text: 'User ID', value: 'user.id', sortable: true, align: 'left' })
            } else if (filter.source.question === 'User') {
              headers.push({ text: 'User', value: 'user.name', sortable: true, align: 'left' })
            } else if (filter.source.question === 'Organisation ID') {
              headers.push({ text: 'Organisation ID', value: 'organisation.id', sortable: true, align: 'left' })
            } else if (filter.source.question === 'Organisation') {
              headers.push({ text: 'Organisation', value: 'organisation.name', sortable: true, align: 'left' })
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
      forms () {
        let forms = this.$store.getters.loadedAllForms(this.slug)
        if (!this.userIsApplicationAdmin) {
          forms = forms.filter(form => {
            const status = this.statuses.find((status) => {
              return status.id === form.form_template.status_id
            })
            return status.status === 'Closed'
          })
        }
        forms.forEach((form) => {
          form.user.name = form.user.first_name + ' ' + form.user.last_name
          form.owner = form.organisation ? form.organisation.name : form.user.first_name + ' ' + form.user.last_name
          form.status = this.status(form.status_id)
        })
        return forms
      },
      statuses () {
        return this.$store.getters.statuses
      },
      comparators () {
        return this.$store.getters.comparators
      },
      sources () {
        let sources = [
          {'group': 'Form Detail', 'question': 'ID'},
          {'group': 'Form Detail', 'question': 'Form Template ID'},
          {'group': 'Form Detail', 'question': 'Form Template'},
          {'group': 'Form Detail', 'question': 'User ID'},
          {'group': 'Form Detail', 'question': 'User'},
          {'group': 'Form Detail', 'question': 'Organisation ID'},
          {'group': 'Form Detail', 'question': 'Organisation'},
          {'group': 'Form Detail', 'question': 'Progress'},
          {'group': 'Form Detail', 'question': 'Period Start'},
          {'group': 'Form Detail', 'question': 'Period End'},
          {'group': 'Form Detail', 'question': 'Status'},
          {'group': 'Form Detail', 'question': 'Created Date'},
          {'group': 'Form Detail', 'question': 'Updated Date'}
        ]
        const questions = this.$store.getters.loadedApplicationQuestions(this.slug)
        _.forEach(questions, (question) => {
          sources.push({'group': question.form_template_name + '-' + question.section_name, 'question': question.question, 'id': question.id})
        }, this)
        return sources
      },
      loadedFormFilters () {
        return this.$store.getters.loadedFormFilters().form_ids
      }
    },
    methods: {
      question (source) {
        if (!source.group) {
          return null
        }

        if (source.group === 'Form Detail') {
          return null
        }

        const formTemplateName = source.group.split('-')[0]
        const formTemplate = this.$store.getters.loadedFormTemplates(this.slug).find((formTemplate) => {
          return formTemplate.name === formTemplateName
        })
        const question = this.$store.getters.loadedAllQuestion(formTemplate.id, this.source.id)
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
        if (source.group === 'Form Detail') {
          if (source.question === 'Form Template' || source.question === 'User' || source.question === 'Organisation' || source.question === 'Status') {
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
      onForm (id) {
        this.$router.push('/forms/' + id)
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
          if (this.filters[i].source.group === 'Form Template') {
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
        this.$store.dispatch('formFilter', {filters: filterParameters, slug: this.slug})
      },
      removeFilter (index) {
        this.filters.splice(index, 1)
      }
    },
    created: function () {
      this.$store.dispatch('loadUsers', this.slug)
      this.$store.dispatch('loadOrganisations', this.slug)
      this.$store.dispatch('loadFormTemplates', this.slug)
      this.$store.dispatch('loadAllSections', this.slug)
      this.$store.dispatch('loadAllForms', this.slug)
    },
    filters: {
      moment: function (date) {
        return moment(date).format('YYYY-MM-DD h:MM A')
      }
    }
  }
</script>
