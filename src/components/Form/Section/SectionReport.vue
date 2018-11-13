<template>
  <v-card flat active-class="active-section" v-if="!isSectionTrigger(section) || formId === -1">

    <v-card-title class="pb-1">
      <div class="subheading font-weight-medium">{{ this.getSectionName(section) }}</div>
    </v-card-title>

    <v-card-text>
      <!-- //Form -->
      <!-- //Standard -->
      <v-layout row wrap v-if="!section.repeatable">
        <template>
          <v-data-table
            :headers="headers"
            :items="list"
            hide-actions
            class="question-answers"
          >
            <template slot="items" slot-scope="props" v-if="!isTrigger(props.item , 1) && showQuestion(props.item)">
              <td>{{ props.item.question }}</td>
              <td>
                <div v-html="$sanitize(answer(props.item, 1))"></div>
              </td>
            </template>
          </v-data-table>
        </template>
      </v-layout>

      <!-- //Repeatable -->
      <template v-else>
        <v-layout
          row
          wrap
          v-for="order in section.repeatable"
          :key="'repeat' + order"
        >
          <v-data-table
            :headers="headers"
            :items="list"
            hide-actions
            class="question-answers"
          >
            <template slot="items" slot-scope="props" v-if="!isTrigger(props.item , order) && showQuestion(props.item)">
              <td>{{ props.item.question }}</td>
              <td>{{ answer(props.item, order) }}</td>
            </template>
          </v-data-table>
        </v-layout>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
  import * as _ from 'lodash'
  import TriggerMixin from '../TriggerMixin.js'

  export default {
    name: 'SectionReport',
    props: ['section', 'formTemplateId', 'formId'],
    mixins: [TriggerMixin],
    data () {
      return {
        headers: [
          {
            text: 'Question',
            align: 'left',
            sortable: false,
            width: '40%'
          },
          {
            text: 'Answer',
            align: 'left',
            sortable: false,
            width: '60%'
          }
        ]
      }
    },
    computed: {
      sections () {
        return this.$store.getters.loadedSections(this.formTemplateId)
      },
      form () {
        if (!this.formId) {
          return null
        }
        return this.$store.getters.loadedForm(parseInt(this.formTemplateId), parseInt(this.formId))
      },
      statuses () {
        return this.$store.getters.statuses
      },
      status () {
        if (!this.form) {
          return null
        }
        return this.getStatus(this.form.status_id)
      },
      list: {
        get () {
          return _.sortBy(this.$store.getters.loadedChildren(this.formTemplateId, this.section.id), element => {
            return element.order
          })
        },
        set (value) {
          // TODO: Drggable components
        }
      },
      isSectionEmpty () {
        return !this.list.length
      }
    },
    methods: {
      getSectionName (section) {
        let name = section.name
        do {
          section = this.getSection(section.parent_section_id)
          name = section ? section.name + ' > ' + name : name
        } while (section)

        return name
      },
      getSection (sectionId) {
        return _.find(this.sections, {id: sectionId})
      },
      showQuestion (question) {
        let show = false
        switch (question.question_type_id) {
          case 12:
            show = false
            break
          default:
            show = true
        }
        return show
      },
      getStatus (statusId) {
        const status = this.statuses.find((status) => {
          return status.id === statusId
        })
        return status ? status.status : 'undefined'
      },
      answer (item, order) {
        const questionType = this.getQuestionType(item.question_type_id)
        const responses = this.form.responses.filter((response) => {
          return response.question_id === item.id && response.order === order
        })
        let response = ''
        switch (questionType) {
          case 'Short answer':
          case 'Paragraph':
          case 'Date':
          case 'Time':
          case 'Linear scale':
          case 'Number':
          case 'Decimal':
          case 'Email':
          case 'Percent':
          case 'Phone number':
            if (responses.length) {
              response = responses[0].response
            }
            break
          case 'File upload':
            if (responses.length) {
              response = '<a href="' + responses[0].response + '" target="_blank">Download File</a>'
            }
            break
          case 'Multiple choice':
          case 'Checkboxes':
          case 'Dropdown':
            const result = responses.map((response) => {
              const answer = item.answers.find((answer) => {
                return answer.id === response.answer_id
              })
              return answer.answer
            })
            response = result.join(', ')
            break
          case 'Multiple choice grid':
          case 'Checkbox grid':
            const result1 = responses.map((response) => {
              const answer = item.answers.find((answer) => {
                return answer.id === response.answer_id
              })
              const res = item.answers.find((answer) => {
                return answer.id === parseInt(response.response)
              })
              return '(' + answer.answer + ', ' + res.answer + ')'
            })
            response = result1.join(', ')
            break
          case 'ABN Lookup':
            if (responses.length) {
              // response = JSON.parse(responses[0].response).Abn
              response = responses[0].response
            }
            break
          case 'Content Block':
            response = item.description
            break
        }
        return response
      }
    }
  }
</script>

<style scoped>
  .v-card__title {
    flex-wrap: unset !important;
  }
  .v-expansion-panel__header div:first-child {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .question-answers >>> th {
    font-weight:500;
    font-size:14px;
    background: #eee;
    color: #000 !important;
  }
  .question-answers {
    width:100%;
  }
</style>
