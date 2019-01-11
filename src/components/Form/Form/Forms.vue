<template>
  <v-layout row wrap>
    <v-flex d-flex xs12>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <h1 class='headline primary--text py-3'>Forms</h1>
          <v-spacer></v-spacer>
          <div class="text-xs-right" v-if="userIsApplicationAdmin">
            <v-btn icon @click="editMode = !editMode">
              <v-icon>edit</v-icon>
            </v-btn>
          </div>
        </v-flex>

        <v-flex d-flex xs12>
          <p>Select an existing form below or <a href='#' @click.stop='createForm = true'>create a new form</a>.</p>
        </v-flex>

        <v-flex>
          <CustomSlot type='formsHeader' :mode="editMode" />
        </v-flex>
        <v-flex d-flex xs12>
          <v-card>
            <v-card-title v-if="userIsApplicationAdmin && editMode">
              <v-container>

                <template v-for='(filter, index) in filters'>

                  <v-layout row wrap>
                    <!-- // Source -->
                    <v-flex xs9 px-3>
                      <v-autocomplete
                        :items='sources'
                        label='Source'
                        v-model='filter.source'
                        item-text='question'
                        item-value='question'
                        single-line
                        return-object
                      >
                        <template
                          slot='selection'
                          slot-scope='data'
                        >
                          {{ data.item.question }}
                        </template>
                        <template
                          slot='item'
                          slot-scope='data'
                        >
                          <v-list-tile-content>
                            <v-list-tile-title>{{data.item.question}}</v-list-tile-title>
                            <v-list-tile-sub-title>{{data.item.group}}</v-list-tile-sub-title>
                          </v-list-tile-content>
                        </template>
                      </v-autocomplete>
                    </v-flex>

                    <!-- // Actions -->
                    <v-flex xs2 px-3 mt-2 text-xs-right>
                      <v-btn outline color='error' @click.stop='deleteFilter(index)'>
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <v-divider class='my-1'></v-divider>
                </template>

                <!-- // Action Buttons -->
                <v-layout row justify-center>
                  <v-flex xs3 px-3>
                    <v-btn block color='primary' @click.stop='addFilter'>Add Filter</v-btn>
                  </v-flex>
                </v-layout>
              </v-container>

            </v-card-title>
            <v-divider></v-divider>

            <!-- //Search -->
            <v-card-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model='search'
                append-icon='search'
                label='Search'
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>

            <!-- //Forms -->
            <v-data-table
              :headers='headers'
              :items='data'
              :search='search'
              hide-actions
            >
              <template slot='items' slot-scope='props'>
                <tr>
                  <template v-for='(item, key) in props.item'>
                    <td @click='onForm(props.item.id)' v-bind:key="'filter'+key" v-if="key !== 'Actions' && key !== 'id'">{{item}}</td>
                  </template>
                  <td class='justify-center layout px-0'>
                    <v-btn icon class='mx-0' @click='duplicateForm(props.item.id)'>
                      <v-icon color='teal'>content_copy</v-icon>
                    </v-btn>
                    <v-btn icon class='mx-0' @click='showDeleteForm(props.item.id)'>
                      <v-icon color='pink'>delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
              <v-alert slot='no-results' :value='true' color='error' icon='warning'>
                Your search for '{{ search }}' found no results.
              </v-alert>
            </v-data-table>

          </v-card>
        </v-flex>

        <v-flex>
          <CustomSlot type='formsFooter' :mode="editMode" />
        </v-flex>
      </v-layout>
    </v-flex>

    <!-- //Action Button -->
    <v-tooltip top>
      <v-btn slot='activator' fixed dark bottom right fab router class='red' @click.stop='createForm = true'>
        <v-icon>add</v-icon>
      </v-btn>
      <span>Create Form</span>
    </v-tooltip>

    <!-- //Create Form -->
    <CreateForm :visible='createForm' :slug='slug' @close='createForm = false' key='CreateForm'></CreateForm>

    <!-- //Delete Form -->
    <DeleteConfirmDialog @delete-action='onDeleteForm' :visible='deleteForm' @close='deleteForm = false'></DeleteConfirmDialog>

    <!-- //Duplicate formTemplate -->
    <DuplicateForm :visible='duplicated' :content='duplicatedContent' @close='duplicated = false'></DuplicateForm>
  </v-layout>
</template>

<script>
  import * as _ from 'lodash'
  import QuestionCompareMixin from './QuestionCompareMixin.js'
  import CreateForm from './CreateForm'
  import DuplicateForm from './DuplicateForm'
  import moment from 'moment'
  import CustomSlot from '../../Layout/CustomSlot'
  import LayoutMixin from '../../Layout/LayoutMixin'
  import UserMixin from '../../Layout/UserMixin'

  export default {
    name: 'Forms',
    components: {
      CreateForm,
      DuplicateForm,
      CustomSlot
    },
    data () {
      return {
        createForm: false,
        search: '',
        filters: [],
        type: 'formColumns',
        filterTemplate: {source: ''},
        selectedId: 0,
        deleteForm: false,
        duplicated: false,
        duplicatedContent: false,
        editMode: false
      }
    },
    mixins: [QuestionCompareMixin, LayoutMixin, UserMixin],
    computed: {
      user () {
        return this.$store.getters.user
      },
      sources () {
        let sources = [
          {'group': 'Form Detail', 'question': 'Form Template'},
          {'group': 'Form Detail', 'question': 'Owner'},
          {'group': 'Form Detail', 'question': 'Owner Email'},
          {'group': 'Form Detail', 'question': 'Organisation'},
          {'group': 'Form Detail', 'question': 'Progress'},
          {'group': 'Form Detail', 'question': 'Period Start'},
          {'group': 'Form Detail', 'question': 'Period End'},
          {'group': 'Form Detail', 'question': 'Status'},
          {'group': 'Form Detail', 'question': 'Created'},
          {'group': 'Form Detail', 'question': 'Modified'}
        ]
        _.forEach(this.questions, (question) => {
          sources.push({'group': question.form_template_name + ' > ' + question.section_name, 'question': question.question, 'id': question.id})
        }, this)
        return sources
      },
      questions () {
        return this.$store.getters.loadedApplicationQuestions(this.slug)
      },
      forms () {
        let forms = this.$store.getters.loadedAllForms(this.slug)
        if (!this.userIsApplicationAdmin) {
          forms = forms.filter(form => {
            const status = this.statuses.find((status) => {
              return status.id === form.form_template.status_id
            })
            return status === 2
          })
        }
        forms.forEach((form) => {
          form.owner = form.organisation ? form.organisation.name : form.user.first_name + ' ' + form.user.last_name
          form.status = this.status(form.status_id)
        })
        return forms
      },
      statuses () {
        return this.$store.getters.statuses
      },

      headers () {
        const headers = []
        // Replace existing headers with new headers
        _.forEach(this.filters, (filter, index) => {
          headers.push({ text: filter.source.question, value: filter.source.question })
        })
        headers.push({ text: 'Actions', value: 'Actions' })
        return headers
      },
      data () {
        const data = []
        // Filter Forms
        _.forEach(this.forms, (form, index) => {
          let linkedResponses = []
          let row = {}
          row['id'] = form.id
          _.forEach(this.filters, filter => {
            if (!filter.source) {
              return
            }
            if (filter.source.group === 'Form Detail') {
              let response = ''
              switch (filter.source.question) {
                case 'Form Template':
                  response = form.form_template.name
                  break
                case 'Owner':
                  response = form.user ? (form.user.first_name + ' ' + form.user.last_name) : ''
                  break
                case 'Owner Email':
                  response = form.user ? form.user.email : ''
                  break
                case 'Organisation':
                  response = form.organisation ? form.organisation.name : ''
                  break
                case 'Progress':
                  response = form.progress
                  break
                case 'Period Start':
                  response = this.date(form.period_start)
                  break
                case 'Period End':
                  response = this.date(form.period_end)
                  break
                case 'Status':
                  response = this.getStatus(form.status_id)
                  break
                case 'Created':
                  response = this.date(form.created_at.date)
                  break
                case 'Modified':
                  response = this.date(form.updated_at.date)
                  break
              }
              // Question, Responses, ComparatorID, QuestionTrigger.answer, QuestionTrigger.value
              row[filter.source.question] = response
            } else {
              const question = this.questions.find((question) => {
                return question.id === filter.source.id
              })
              let responses = form.responses.filter((response) => {
                return response.question_id === filter.source.id
              })
              if (!responses.length) {
                responses = linkedResponses.filter((response) => {
                  return response.question_id === filter.source.id
                })
              }
              const questionType = this.getQuestionType(question.question_type_id)
              let order = 1
              if (responses.length) {
                order = Math.max(responses.map(response => response.order))
              }
              for (let i = 1; i <= order; i++) {
                const orderResponses = responses.filter((response) => {
                  return response.order === i
                })
                row[filter.source.question] = this.questionToResponse(question, orderResponses)
                if (questionType === 'Lookup' && orderResponses.length) {
                  if (question.answers.length) {
                    const value = JSON.parse(question.answers[0].answer)
                    const editFormTemplateId = value.formTemplateId
                    if (editFormTemplateId) {
                      const editQuestionId = value.questionId
                      const editQuestion = this.$store.getters.loadedAllQuestion(editFormTemplateId, editQuestionId)
                      const forms = this.$store.getters.loadedForms(editFormTemplateId)
                      const questionResponses = []
                      _.forEach(forms, (form, index) => {
                        const formResponses = form.responses.filter(response => response.question_id === editQuestionId)
                        _.forEach(formResponses, (formResponse, index) => {
                          const response = this.questionToResponse(editQuestion, [formResponse])
                          questionResponses.push({id: formResponse.id, response: response, form_id: form.id})
                        })
                      })
                      const lookupResult = questionResponses.find(questionResponse => questionResponse.id === parseInt(orderResponses[0].response))
                      const lookupForm = forms.find(form => lookupResult.form_id === form.id)
                      linkedResponses = linkedResponses.concat(lookupForm.responses)
                    }
                  }
                }
              }
            }
          })
          data.push(row)
        })
        return data
      }
    },
    watch: {
      filters: {
        handler (newValue, oldValue) {
          if (oldValue.length) {
            this.updateText()
          }
        },
        deep: true
      }
    },
    methods: {
      updateText () {
        if (!this.meta) {
          const newMeta = {}
          newMeta[this.type] = this.filters
          this.createMeta(JSON.stringify(newMeta))
        } else {
          try {
            const oldMetaData = JSON.parse(this.meta.metadata)
            oldMetaData[this.type] = this.filters
            this.updateMeta(JSON.stringify(oldMetaData))
          } catch (error) {
            return false
          }
        }
      },
      showDeleteForm (id) {
        this.selectedId = id
        this.deleteForm = true
      },
      onDeleteForm () {
        const formTemplateId = this.forms.find(form => form.id === this.selectedId).form_template.id
        this.$store.dispatch('deleteForm',
          {
            formTemplateId: formTemplateId,
            id: this.selectedId
          }
        )
      },
      duplicateForm (id) {
        const formTemplateId = this.forms.find(form => form.id === id).form_template.id
        this.$store.dispatch('duplicateForm', {
          formTemplateId: formTemplateId,
          id: id
        })
          .then((response) => {
            this.duplicated = true
            this.duplicatedContent = response.data.form.id
          })
      },
      onForm (id) {
        this.$router.push('/forms/' + id)
      },
      jsonCopy (src) {
        return JSON.parse(JSON.stringify(src))
      },
      date (value) {
        if (!value) {
          return value
        }
        return moment(value).format('YYYY-MM-DD h:MM A')
      },
      status (id) {
        return this.statuses.find(e => { return e.id === id }).status
      },
      deleteFilter (index) {
        this.filters.splice(index, 1)
      },
      addFilter () {
        const newFilter = this.jsonCopy(this.filterTemplate)
        this.filters.push(newFilter)
      }
    },
    created: function () {
      if (this.user) {
        this.$store.dispatch('loadUsers', this.slug)
        this.$store.dispatch('loadOrganisations', this.slug)
        this.$store.dispatch('loadFormTemplates', this.slug)
        this.$store.dispatch('loadAllSections', this.slug)
        this.$store.dispatch('loadAllForms', this.slug)
        this.$store.dispatch('loadAllOrganisationUsers', this.slug)

        this.filters = this.metaValue(this.type)
        if (!this.filters) {
          this.filters = [
            {
              'source': {
                'group': 'Form Detail',
                'question': 'Form Template'
              }
            },
            {
              'source': {
                'group': 'Form Detail',
                'question': 'Owner'
              }
            },
            {
              'source': {
                'group': 'Form Detail',
                'question': 'Owner Email'
              }
            },
            {
              'source': {
                'group': 'Form Detail',
                'question': 'Created'
              }
            },
            {
              'source': {
                'group': 'Form Detail',
                'question': 'Modified'
              }
            },
            {
              'source': {
                'group': 'Form Detail',
                'question': 'Progress'
              }
            },
            {
              'source': {
                'group': 'Form Detail',
                'question': 'Status'
              }
            }
          ]
        }
      }
    }
  }
</script>
