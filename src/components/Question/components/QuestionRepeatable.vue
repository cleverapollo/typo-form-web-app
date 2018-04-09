<template>
  <v-layout row wrap justify-space-around>
    <v-flex xs5 style='min-width: 130px'>
      <v-text-field label='Minimum rows count' @change='updateMinRows' :value='minRows'></v-text-field>
      <h3>Rows</h3>
      <draggable v-model='computedQuestions' class='dragArea1' :options='{draggable:".repeatableItem"}' style='min-height: 100px' @end='checkEnd'>
        <v-layout row v-for='(question, index) in computedQuestions' :key='"Option " + index' class='repeatableItem' :class='"item" + question.id'>
          <v-flex style='max-width: 20px; min-width: 20px' class='mt-4'>
            {{index+1}}.
          </v-flex>
          <v-flex xs10 style='min-width: 60px'>
            <v-text-field
              :value='question.question'
              autofocus
              @change='updateQuestion(question.id, $event)'
            ></v-text-field>
          </v-flex>
          <v-flex style='width: 30px' v-show='computedQuestions.length > 1'>
            <v-btn flat icon @click='deleteQuestion(question.id)' class='mt-3 mx-0'>
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout row wrap d-inline-flex>
          <v-flex style='min-width: 20px' class='mt-4'>
            {{computedQuestions.length+1}}.
          </v-flex>
          <v-flex xs10 style='max-width: 80px'>
            <v-text-field
              value='Add Row'
              @click='createQuestion()'
            ></v-text-field>
          </v-flex>
        </v-layout>
      </draggable>
    </v-flex>
    <v-flex xs5 style='min-width: 130px'>
      <v-text-field label='Maximum rows count' @change='updateMaxRows' :value='maxRows'></v-text-field>
      <h3>Columns</h3>
      <draggable v-model='computedAnswers' class='dragArea2' :options='{draggable:".repeatableItem"}' style='min-height: 100px' @end='checkEnd'>
        <v-layout row v-for='(answer, index) in computedAnswers' :key='"Option " + index' class='repeatableItem' :class='"item" + answer.id'>
          <v-flex xs10 style='min-width: 100px'>
            <v-text-field
              prepend-icon='radio_button_unchecked'
              :value='answer.answer'
              autofocus
              @change='updateAnswer(answer.id, $event)'
            ></v-text-field>
          </v-flex>
          <v-flex style='width: 30px' v-show='computedAnswers.length > 1'>
            <v-btn flat icon @click='deleteAnswer(answer.id)' class='mt-3 mx-0'>
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout row wrap d-inline-flex>
          <v-flex style='width: 130px'>
            <v-text-field
              prepend-icon='radio_button_unchecked'
              value='Add Column'
              @click='createAnswer()'
            ></v-text-field>
          </v-flex>
        </v-layout>
      </draggable>
    </v-flex>
  </v-layout>
</template>

<script>
  import draggable from 'vuedraggable'
  export default {
    name: 'question-repeatable',
    props: {
      'questions': {
        type: Array,
        default: function () {
          return []
        }
      },
      'minRows': {
        default: null
      },
      'maxRows': {
        default: null
      }
    },
    components: {
      draggable
    },
    methods: {
      createQuestion () {
        const question = `Row ${this.computedQuestions.length + 1}`
        this.$emit('create-question', [question, 'Row', 1, true])
      },
      updateQuestion (index, value) {
        this.$emit('update-question', [index, value])
      },
      deleteQuestion (index) {
        this.$emit('delete-question', index)
      },
      createAnswer () {
        const answer = `Column ${this.computedAnswers.length + 1}`
        const questionid = this.questions.find((question) => {
          return question.question === 'Answers'
        }).id
        this.$emit('create-answer', [questionid, answer])
      },
      deleteAnswer (index) {
        const questionid = this.questions.find((question) => {
          return question.question === 'Answers'
        }).id
        this.$emit('delete-answer', [questionid, index])
      },
      updateAnswer (index, value) {
        const questionid = this.questions.find((question) => {
          return question.question === 'Answers'
        }).id
        this.$emit('update-answer', [questionid, index, value])
      },
      checkEnd: function (evt) {
        if (evt.to.className !== evt.from.className) {
          return
        }
        if (evt.newIndex === evt.oldIndex) {
          return
        }
        let newIndex = evt.newIndex

        if (evt.newIndex > evt.oldIndex) {
          newIndex = newIndex + 1
        }
        const elementId = parseInt(evt.item.className.substr(30))

        let order = 1
        if (evt.to.className === 'dragArea1') {
          if (this.computedQuestions.length === newIndex) {
            order = this.computedQuestions[newIndex - 1].order + 1
          } else {
            order = this.computedQuestions[newIndex].order
          }
          this.$emit('move-question', [elementId, order])
        } else {
          if (this.computedAnswers.length === newIndex) {
            order = this.computedAnswers[newIndex - 1].order + 1
          } else {
            order = this.computedAnswers[newIndex].order
          }
          const questionid = this.questions.find((question) => {
            return question.question === 'Answers'
          }).id
          this.$emit('move-answer', [questionid, elementId, order])
        }
      },
      updateMinRows (value) {
        const min = parseInt(value)
        console.log('min', min)
        if (this.maxRows && this.maxRows < min) { // validation
          console.log('this.maxRows && this.maxRows < min', this.maxRows, this.maxRows < min)
          // return
        } else {
          console.log('emit')
          this.$emit('update-limitation', {
            'min_rows': min
          })
        }
      },
      updateMaxRows (value) {
        const max = parseInt(value)
        console.log('max', max)
        if (this.minRows && this.minRows > max) { // validation
          // return
        } else {
          this.$emit('update-limitation', {
            max_rows: max
          })
        }
      }
    },
    computed: {
      computedQuestions: {
        get () {
          return this.questions.filter((question) => {
            return question.question !== 'Answers'
          }).sort((questionA, questionB) => {
            return questionA.order > questionB.order
          })
        },
        set (value) {
          // TODO: Draggable
        }
      },
      computedAnswers: {
        get () {
          if (!this.questions.length) {
            return []
          }
          return this.questions.find((question) => {
            return question.question === 'Answers'
          }).answers.sort((answerA, answerB) => {
            return answerA.order > answerB.order
          })
        },
        set (value) {
          // TODO: Draggable
        }
      }
    }
  }
</script>
