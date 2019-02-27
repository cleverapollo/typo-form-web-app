<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-radio-group v-model="optionModel" :row="hasValidation">
        <template v-for='(answer, index) in list'>
          <v-radio
            color="info"
            :disabled="disabled"
            :key='"Option " + index'
            :label="answer.answer"
            :value="answer.id"
            @change="onSave(answer.id)"
            v-if="!answer.parameter"
          >
          </v-radio>
          <v-layout row wrap class="radio-other" v-else>
            <v-radio
              color="info"
              :disabled="disabled"
              :value="answer.id"
              @change="onSave(answer.id)"
              class="shrink mr-1"
            >
            </v-radio>
            <v-text-field
              :label="answer.answer"
              :disabled="responses.length && responses[0].answer_id !== answer.id"
              :value="responseValue(answer.id)"
              @change="onUpdate(answer.id, $event)"
            >
            </v-text-field>
          </v-layout>
        </template>
      </v-radio-group>
    </v-flex>
  </v-layout>
</template>

<script>
  import * as _ from 'lodash'
  export default {
    name: 'multiple-choice',
    props: ['question', 'answers', 'responses', 'disabled', 'hasValidation', 'questionId', 'formTemplateId'],
    data () {
      return {
        optionModel: this.responses.length ? this.responses[0].answer_id : ''
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
      onSave (answerId) {
        if (this.responses.length) {
          this.$emit('update-response', [answerId, null, this.responses[0].id])
        } else {
          this.$emit('create-response', [answerId, null])
        }
      },
      onUpdate (answerId, value) {
        if (this.responses.length) {
          this.$emit('update-response', [answerId, value, this.responses[0].id])
        }
      }
    }
  }
</script>

<style>
  .question-group .v-input--radio-group .v-input__control {
    width:100%;
  }
  .question-group .v-input--radio-group .v-input__control .v-text-field__slot .v-label {
    top:6px;
  }
  .question-group .v-input--radio-group .v-input__control .v-text-field__slot .v-label.v-label--active {
    top:12px;
  }
</style>
