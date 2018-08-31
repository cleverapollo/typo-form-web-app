<template>
  <v-card flat active-class="active-section" v-if="!isSectionTrigger(section) || submissionId === -1">

    <v-card-title>
      {{ section.name }}
    </v-card-title>

    <v-card-text>
      <!-- //Submission -->
      <!-- //Standard -->
      <v-layout row wrap v-if="!section.repeatable">
        <template v-if="list.length && list[0].questions">
          <template v-for="(element, index) in list" v-if="!isTrigger(element , 1)">
            <SectionReport
              :section="element"
              :formId="formId"
              :submissionId="submissionId"
              v-if="element.questions"
            ></SectionReport>
          </template>
        </template>
        <template v-else>
          <v-data-table
            :items="list"
            class="elevation-1"
            hide-actions
            hide-headers
          >
            <template slot="items" slot-scope="props" v-if="!isTrigger(props.item , 1)">
              <td>{{ props.item.question }}</td>
              <td class="text-xs-right">{{ answer(props.item, 1) }}</td>
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
            :items="list"
            class="elevation-1"
            hide-actions
            hide-headers
          >
            <template slot="items" slot-scope="props" v-if="!isTrigger(props.item , order)">
              <td>{{ props.item.question }}</td>
              <td class="text-xs-right">{{ answer(props.item, order) }}</td>
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
    props: ['section', 'formId', 'submissionId'],
    mixins: [TriggerMixin],
    computed: {
      sections () {
        return this.$store.getters.loadedSections(this.formId)
      },
      submission () {
        if (!this.submissionId) {
          return null
        }
        return this.$store.getters.loadedSubmission(parseInt(this.formId), parseInt(this.submissionId))
      },
      statuses () {
        return this.$store.getters.statuses
      },
      status () {
        if (!this.submission) {
          return null
        }
        return this.getStatus(this.submission.status_id)
      },
      list: {
        get () {
          return _.sortBy(this.$store.getters.loadedChildren(this.formId, this.section.id), element => {
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
      getStatus (statusId) {
        const status = this.statuses.find((status) => {
          return status.id === statusId
        })
        return status ? status.status : 'undefined'
      },
      answer (item, order) {
        const questionType = this.getQuestionType(item.question_type_id)
        const responses = this.submission.responses.filter((response) => {
          return response.question_id === item.id && response.order === order
        })
        let response = ''
        switch (questionType) {
          case 'Short answer':
          case 'Paragraph':
          case 'File upload':
          case 'Date':
          case 'Time':
          case 'Linear scale':
            if (responses.length) {
              response = responses[0].response
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
</style>
