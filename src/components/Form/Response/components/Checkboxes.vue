<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-layout row v-for='(answer, index) in list' :key='"Option " + index' :class='"item" + index + " checkbox"'>
        <v-checkbox 
          color="info"
          :disabled="disabled"
          :label="answer.answer"
          v-model='checkAnswers'
          :value="answer.id"
          @change="onSave(answer.id)"
          hide-details
          v-if="!answer.parameter"
         >
        </v-checkbox>
        <template v-else>
          <v-checkbox
            color="info"
            :disabled="disabled"
            v-model='checkAnswers'
            :value="answer.id"
            @change="onSave(answer.id)"
            hide-details
            class="shrink mr-1"
          >
          </v-checkbox>
          <v-text-field
            :disabled="!checkAble(answer.id)"
            :label="answer.answer"
            :value="responseValue(answer.id)"
            @change="onUpdate(answer.id, $event)"
          >
          </v-text-field>
        </template>
      </v-layout>
    </v-flex>
    <v-flex xs12 class='error' v-show='validate() !== true'>
      {{ validate() }}
    </v-flex>
  </v-layout>
</template>

<script>
  import validationMixin from '../ResponseValidationMixin'
  import * as _ from 'lodash'

  export default {
    name: 'checkboxes',
    mixins: [validationMixin],
    props: ['question', 'answers', 'responses', 'formId', 'disabled', 'formTemplateId'],
    data () {
      return {
        checkAnswers: []
      }
    },
    mounted () {
      this.checkAnswers = this.responses.map((response) => {
        return response.answer_id
      })
    },
    watch: {
      formId (value) {
        this.checkAnswers = this.responses.map((response) => {
          return response.answer_id
        })
      }
    },
    computed: {
      answerSort () {
        const question = this.$store.getters.loadedAllQuestion(this.formTemplateId, this.questionId)
        const answerSort = _.find(this.answerSorts, sort => {
          return sort.id === question.sort_id
        })
        return answerSort ? answerSort.sort : 'Undefined'
      },
      answerSorts () {
        return this.$store.getters.answerSorts
      },
      list: {
        get () {
          const answers = this.answers
          if (this.answerSort === 'Alphanumeric Ascending (A-Z)') {
            return _.orderBy(answers, ['answer'], ['asc'])
          }
          if (this.answerSort === 'Alphanumeric Descending (Z-A)') {
            return _.orderBy(answers, ['answer'], ['desc'])
          }
          if (this.answerSort === 'Number Ascending (1-9)') {
            return _.orderBy(answers, [answer => parseInt(answer.answer)], ['asc'])
          }
          if (this.answerSort === 'Number Descending (9-1)') {
            return _.orderBy(answers, [answer => parseInt(answer.answer)], ['desc'])
          }
          return _.orderBy(answers, ['order'], ['asc'])
        },
        set (value) {
          // TODO: Drggable components
        }
      }
    },
    methods: {
      responseValue (answerId) {
        const response = this.responses.find(response => response.answer_id === answerId)
        if (response) {
          return response.response
        }
        return null
      },
      checkAble (answerId) {
        const index = this.responses.findIndex((response) => {
          return response.answer_id === answerId
        })
        return index !== -1
      },
      responseIdFromAnswer (answerId) {
        const response = this.responses.find((response) => {
          return response.answer_id === answerId
        })
        return response.id
      },
      onSave (answerId) {
        if (!this.checkAble(answerId)) {
          this.$emit('create-response', [answerId, null])
        } else {
          this.$emit('delete-response', this.responseIdFromAnswer(answerId))
        }
      },
      onUpdate (answerId, value) {
        if (this.checkAble(answerId)) {
          const response = this.responses.find((response) => response.answer_id === answerId)
          this.$emit('update-response', [answerId, value, response.id])
        }
      }
    }
  }
</script>

<style>
.question-group .checkbox:nth-child(n+2) .v-input--selection-controls {
  margin-top:0px;
}
.question-group .checkbox .v-input--selection-controls .v-input__slot {
  margin-bottom:8px;
}
.question-group .checkbox .v-input.v-text-field {
  padding-top:0px;
}
</style>
